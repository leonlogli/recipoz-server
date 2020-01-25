import { errorMessages } from '../constants'
import { Category } from '../models'
import { QueryOptions, DocTransformOptions } from '../utils'
import ModelService from './ModelService'

const {
  notFound: dataNotFound,
  deleteNotFound: dataToDeleteNotFound,
  updateNotFound: dataToUpdateNotFound
} = errorMessages.category

const docTransformOptions: DocTransformOptions = {
  i18nFields: ['name', 'description'],
  refDocs: [{ parentCategory: 'Category' }]
}

const partialSearchFields = [
  'name.en',
  'name.fr',
  'description.en',
  'description.fr'
]

const categoryModel = new ModelService({
  model: Category,
  docTransformOptions,
  partialSearchFields,
  errorMessages: { dataNotFound, dataToDeleteNotFound, dataToUpdateNotFound }
})

const getCategoryById = async (id: any) => {
  return categoryModel.findById(id)
}

const getCategory = async (criteria: any, filter: string[]) => {
  return categoryModel.findOne(criteria, filter)
}

const getCategories = async (criteria: any, options: QueryOptions) => {
  return categoryModel.find(criteria, options)
}

const addCategory = async (category: any) => {
  return categoryModel.create(category)
}

const updateCategory = async (id: any, category: any) => {
  return categoryModel.update(id, category)
}

const deleteCategory = async (id: any) => {
  return categoryModel.delete(id)
}

export default {
  getCategoryById,
  getCategory,
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory
}
