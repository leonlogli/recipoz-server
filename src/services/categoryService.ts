import { errorMessages, statusMessages } from '../constants'
import { Category, CategoryDocument } from '../models'
import ModelService from './common/ModelService'
import {
  QueryOptions,
  DataLoaders,
  buildFilter,
  extractFilterElements,
  UserInputError,
  i18n,
  categoryMutationErrorHandler as handleMutationError
} from '../utils'

const { created, deleted, updated } = statusMessages.category
const { notFound } = errorMessages.category

const categoryModel = new ModelService<CategoryDocument>({
  model: Category,
  autocompleteField: 'name',
  i18nFields: ['name', 'description'],
  onNotFound: notFound
})

const countCategoriesByBatch = categoryModel.countByBatch
const getCategory = categoryModel.findByIds
const getCategoriesByBatch = categoryModel.batchFind
const autocomplete = categoryModel.autocompleteSearch

const handleRefFilter = async (filter: string, loaders?: DataLoaders) => {
  if (filter.startsWith('parentCategory.')) {
    const { i18nFields } = categoryModel
    const { path, value } = extractFilterElements(filter, i18nFields)

    if (path.startsWith('parentCategory.parentCategory')) {
      const validationErrors = { path: 'parentCategory' }
      const message = errorMessages.invalidFilter

      throw new UserInputError(message, { validationErrors })
    }
    const criteria = { [path.substring(15)]: value }
    const categories = await categoryModel.findAndSelect(criteria, '', loaders)
    const ids = categories.map(c => c._id).join()

    return `parentCategory.in:${ids || 'notfound ids'}`
  }

  return filter
}

const getCategories = async (
  query: any,
  opts: QueryOptions,
  loaders?: DataLoaders
) => {
  const filterResult = await buildFilter(
    opts.filter || [],
    filter => handleRefFilter(filter, loaders),
    categoryModel.i18nFields
  )

  opts.filter = filterResult as any

  return categoryModel.find(query, opts, loaders)
}

const addCategory = async (data: any, dataLoaders: DataLoaders) => {
  try {
    if (data.parentCategory) {
      await dataLoaders.categoryLoader.load(data.parentCategory)
    }
    const category = await categoryModel.create(data)
    const message = i18n.t(created)

    return { success: true, message, code: 201, category }
  } catch (error) {
    return handleMutationError(error)
  }
}

const updateCategory = async (id: any, data: any, loaders?: DataLoaders) => {
  const { categoryLoader } = loaders || {}

  try {
    if (categoryLoader && data.parentCategory) {
      await categoryLoader.load(data.parentCategory)
    }
    const category = await categoryModel.update(id, data, loaders)

    return { success: true, message: i18n.t(updated), code: 200, category }
  } catch (error) {
    return handleMutationError(error)
  }
}

const deleteCategory = async (id: any) => {
  try {
    const category = await categoryModel.delete(id)

    return { success: true, message: i18n.t(deleted), code: 200, category }
  } catch (error) {
    return handleMutationError(error)
  }
}

export const categoryService = {
  countCategoriesByBatch,
  getCategory,
  getCategoriesByBatch,
  autocomplete,
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory
}
export default categoryService
