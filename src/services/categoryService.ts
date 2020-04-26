import { Category, CategoryDocument, Recipe } from '../models'
import ModelService from './base/ModelService'
import {
  DataLoaders,
  buildFilterQuery,
  i18n,
  locales,
  OffsetPage,
  errorRes,
  isDuplicateError
} from '../utils'
import followershipService from './followershipService'
import { logger } from '../config'

const { statusMessages, errorMessages } = locales
const { created, deleted, updated } = statusMessages.category
const { notFound, nameAlreadyExists } = errorMessages.category

const categoryModel = new ModelService<CategoryDocument>({
  model: Category,
  autocompleteField: 'name',
  i18nFields: ['name', 'description'],
  onNotFound: notFound
})

const countCategories = categoryModel.countByBatch
const getCategories = categoryModel.findByIds
const getCategoriesByBatch = categoryModel.batchFind
const autocomplete = categoryModel.autocompleteSearch

const search = async (
  query: string,
  page: OffsetPage,
  filter?: any,
  loaders?: DataLoaders
) => {
  const filterQuery = buildFilterQuery(filter)

  return categoryModel.search(query, page, filterQuery, loaders)
}

const handleMutationError = (error: any) => {
  if (isDuplicateError(error)) {
    return { success: false, message: i18n.t(nameAlreadyExists), code: 409 }
  }

  return errorRes(error)
}

const addCategory = async (data: any, loaders: DataLoaders) => {
  try {
    if (data.parent) {
      await loaders.categoryLoader.load(data.parent)
    }
    const category = await categoryModel.create(data)

    return { success: true, message: i18n.t(created), code: 201, category }
  } catch (error) {
    return handleMutationError(error)
  }
}

const updateCategory = async (value: any, loaders: DataLoaders) => {
  const { id, ...data } = value

  try {
    if (data.parent) {
      if (data.parent === id) {
        const message = 'The category must be different from its parent'

        return { success: false, message, code: 422 }
      }
      await loaders.categoryLoader.load(data.parent)
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

    Promise.all([
      followershipService.deleteFollowers(category._id, 'Category'),
      Recipe.updateMany(
        { categories: category._id },
        { $pull: { categories: category._id } }
      ).exec()
    ])
      .then(() => logger.info('Category data deleted successfully'))
      .catch(e => logger.error(`Error deleting category (${id}) data: `, e))

    return { success: true, message: i18n.t(deleted), code: 200, category }
  } catch (error) {
    return handleMutationError(error)
  }
}

export const categoryService = {
  getCategories,
  getCategoriesByBatch,
  autocomplete,
  search,
  addCategory,
  deleteCategory,
  updateCategory,
  countCategories
}
export default categoryService
