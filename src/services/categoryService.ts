import { Category } from '../models'
import { Pageable } from '../utils/Util'
import { logger } from '../config'

/**
 * Finds a single document by its _id field
 * @param id value of _id to query by
 */
const getCategory = async (id: any) => {
  const category = await Category.findById(id).exec()

  return category
}

/**
 * @param pageOptions page options.
 * @param _sort A collection of sort directives. (See Mongoose doc)
 */
const getCategories = async (
  searchText: string,
  pageOptions?: Pageable,
  sort?: string
) => {
  const page = pageOptions && pageOptions.page > 1 ? pageOptions.page : 1
  const size = pageOptions && pageOptions.size > 0 ? pageOptions.size : 1
  const textScore = { score: { $meta: 'textScore' } }
  const searchConditions = {
    $text: {
      $search: searchText
    }
  }

  let categories = await Category.find(
    searchText ? searchConditions : {},
    searchText ? textScore : {}
  )
    .limit(size)
    .skip(size * (page - 1))
    .sort(searchText ? textScore : sort)
    .exec()

  if (!categories.length) {
    logger.info('Begining partial text search...')
    const regex = new RegExp(searchText, 'i')

    categories = await Category.find({
      $or: [
        { 'subCategory.type': regex },
        { name: regex },
        { description: regex }
      ]
    }).exec()
  }

  const count = await Category.countDocuments(
    searchText ? searchConditions : {}
  ).exec()

  return {
    categories,
    page,
    pageCount: Math.ceil(count / size)
  }
}

const categories = async (sort?: string) => {
  return Category.find()
    .sort(sort)
    .exec()
}

const findCategories = async (searchText: any) => {
  const regex = new RegExp(searchText, 'i')

  return Category.find({
    $or: [
      { 'subCategory.type': regex },
      { name: regex },
      { description: regex }
    ]
  }).exec((err, _categories) => {
    return _categories
  })
}

/**
 * Gets the user data for the user corresponding to a given email.
 * @param email The email corresponding to the user whose data to fetch.
 */
const addCategory = async (category: any) => {
  const createdCategory = await Category.create(category)

  return createdCategory
}

const updateCategory = async (id: any, category: any) => {
  const updatedCategory = await Category.findByIdAndUpdate(id, category).exec()

  return updatedCategory
}

const deleteCategory = async (id: any) => {
  const createdCategory = await Category.findByIdAndDelete(id).exec()

  return createdCategory
}

export default {
  getCategory,
  getCategories,
  findCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  categories
}
