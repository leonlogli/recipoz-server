import { errorMessages } from '../constants'
import { IngredientDocument, Ingredient } from '../models'
import { QueryOptions, DocTransformOptions } from '../utils'
import ModelService from './ModelService'

const {
  notFound: dataNotFound,
  deleteNotFound: dataToDeleteNotFound,
  updateNotFound: dataToUpdateNotFound
} = errorMessages.ingredient

const docTransformOptions: DocTransformOptions = {
  i18nFields: ['name', 'description']
}

const partialSearchFields = [
  'name.en',
  'name.fr',
  'description.en',
  'description.fr'
]

const ingredientModel = new ModelService({
  model: Ingredient,
  docTransformOptions,
  partialSearchFields,
  errorMessages: { dataNotFound, dataToDeleteNotFound, dataToUpdateNotFound }
})

const getIngredientById = async (id: any) => {
  return ingredientModel.findById(id)
}

const getIngredient = async (criteria: any, filter: string[]) => {
  return ingredientModel.findOne(criteria, filter)
}

const getIngredients = async (criteria: any, options: QueryOptions) => {
  return ingredientModel.find(criteria, options)
}

const addIngredient = async (ingredient: any) => {
  return ingredientModel.create(ingredient)
}

const updateIngredient = async (id: any, ingredient: IngredientDocument) => {
  return ingredientModel.update(id, ingredient)
}

const deleteIngredient = async (id: any) => {
  return ingredientModel.delete(id)
}

export default {
  getIngredientById,
  getIngredient,
  getIngredients,
  addIngredient,
  deleteIngredient,
  updateIngredient
}
