import { ApolloError } from 'apollo-server-express'
import status from 'http-status'

import { logger, DEFAULT_PAGE_SIZE } from '../config'
import { Category, CategoryDocument } from '../models'
import {
  dotify,
  transformDoc,
  transformDocs,
  Pageable,
  isString,
  transformSortDirectives,
  i18n
} from '../utils'
import { errorMessages } from '../constants'

const { categoryNotFound } = errorMessages

/**
 * Finds a single Category document by its id field
 * @param id document id
 */
const getCategoryById = async (id: any) => {
  const category: CategoryDocument = await Category.findById(id)
    .lean()
    .exec()

  if (!category) {
    throw new ApolloError(i18n.t(categoryNotFound), status['404_NAME'])
  }

  return transformDoc(category, true, 'name', 'description')
}

/**
 * Finds a single Category document by the specified criteria
 * @param criteria query criteria
 */
const getCategory = async (criteria: any) => {
  const category: CategoryDocument = await Category.findOne(criteria)
    .lean()
    .exec()

  if (!category) {
    throw new ApolloError(i18n.t(categoryNotFound), status['404_NAME'])
  }

  return transformDoc(category, true, 'name', 'description')
}

/**
 * Finds paged categories by the specified criteria
 * @param criteria query criteria
 */
const partiallySearchCategories = async (
  searchText: string,
  pageNumber?: number,
  pageSize?: number
) => {
  const regex = new RegExp(searchText, 'i')
  const conditions = {
    $or: [
      { 'subCategory.type': regex },
      { 'name.en': regex },
      { 'name.fr': regex },
      { 'description.en': regex },
      { 'description.fr': regex }
    ]
  }

  const query = Category.find(conditions).lean()

  if (pageSize && pageNumber) {
    query.limit(pageSize).skip(pageSize * (pageNumber - 1))
  }

  const categories = await query.exec()
  const count = await Category.countDocuments(conditions).exec()

  return { categories, count }
}

/**
 * Finds paged categories by the specified criteria
 * @param criteria query criteria
 * @param options pagination informations
 */
const getCategories = async (criteria: any, options: Pageable) => {
  let conditions = criteria || {}
  const isSearchText = criteria && isString(criteria)

  if (isSearchText) {
    conditions = { $text: { $search: criteria } }
  }

  const { page, limit, sort, paginate } = options
  const sortDirectives = transformSortDirectives(sort, 'name', 'description')
  const pageNumber = page && page > 1 ? page : 1
  const pageSize = limit && limit > 0 ? limit : DEFAULT_PAGE_SIZE
  const textScore = { score: { $meta: 'textScore' } }

  const query = Category.find(conditions, isSearchText ? textScore : {})
    .sort(isSearchText ? textScore : sortDirectives)
    .lean()

  if (paginate) {
    query.limit(pageSize).skip(pageSize * (pageNumber - 1))
  }

  let categories = await query.exec()
  let count = await Category.countDocuments(conditions).exec()

  if (!categories.length && isSearchText) {
    logger.info('Begining partial text search...')
    const data = await partiallySearchCategories(criteria, pageNumber, pageSize)
    const { categories: _categories, count: _count } = data

    categories = _categories
    count = _count
  }

  categories = transformDocs(categories, true, 'name', 'description')

  if (!page && !limit && !paginate) {
    return categories
  }

  const pageCount = Math.ceil(count / pageSize)

  return {
    categories,
    page: {
      number: Math.min(pageNumber, pageCount),
      size: pageSize,
      count: pageCount,
      totalItems: count
    }
  }
}

const addCategory = async (category: any) => {
  const createdCategory = await Category.create(category)

  return transformDoc(createdCategory, true, 'name', 'description')
}

const updateCategory = async (id: any, category: CategoryDocument) => {
  const updatededCategory = await Category.findByIdAndUpdate(
    id,
    { $set: dotify(category) },
    { new: true }
  )
    .lean()
    .exec()

  if (!updatededCategory) {
    throw new ApolloError(i18n.t(categoryNotFound), status['404_NAME'])
  }

  return transformDoc(updatededCategory, true, 'name', 'description')
}

const deleteCategory = async (id: any) => {
  const deletedCategory = await Category.findByIdAndDelete(id).exec()

  if (!deletedCategory) {
    throw new ApolloError(i18n.t(categoryNotFound), status['404_NAME'])
  }

  return transformDoc(deletedCategory, true, 'name', 'description')
}

export default {
  getCategoryById,
  getCategory,
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory
}
