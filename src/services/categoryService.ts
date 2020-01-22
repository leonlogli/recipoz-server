import { errorMessages } from '../constants'
import { CategoryDocument } from '../models'
import { Model, QueryOptions, DocTransformOptions } from '../utils'

const {
  categoryNotFound,
  categoryToDeleteNotFound,
  categoryToUpdateNotFound
} = errorMessages

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

const categoryModel = new Model({
  modelName: 'Category',
  populatePaths: 'parentCategory',
  docTransformOptions,
  partialSearchFields,
  errorMessages: {
    dataNotFound: categoryNotFound,
    dataToDeleteNotFound: categoryToDeleteNotFound,
    dataToUpdateNotFound: categoryToUpdateNotFound
  }
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

const updateCategory = async (id: any, category: CategoryDocument) => {
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
