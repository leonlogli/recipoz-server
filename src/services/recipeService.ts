import { errorMessages } from '../constants'
import { Recipe } from '../models'
import { QueryOptions } from '../utils'
import ModelServiceBase from './common/ModelServiceBase'

const recipeModel = new ModelServiceBase({
  model: Recipe,
  filterOptions: {
    refDocs: []
  },
  onNotFound: errorMessages.recipe.notFound
})

const getRecipeById = async (id: any) => {
  return recipeModel.findById(id)
}

const getRecipe = async (criteria: any, filter = []) => {
  return recipeModel.findOne(criteria, filter)
}

const getRecipeAndSelect = async (criteria: any, fieldsToSelect: string) => {
  const recipe = await Recipe.findOne(criteria, fieldsToSelect, {
    lean: true
  }).exec()

  return recipe
}

const getRecipes = async (criteria: any, options: QueryOptions) => {
  return recipeModel.find(criteria, options)
}

const addRecipe = async (recipe: any) => {
  const { id, type: authorModel } = recipe.author || {}

  return recipeModel.create({ ...recipe, author: id, authorModel })
}

const updateRecipe = async (id: any, recipe: any) => {
  return recipeModel.update(id, recipe)
}

const deleteRecipe = async (id: any) => {
  return recipeModel.delete(id)
}

export default {
  getRecipeById,
  getRecipe,
  addRecipe,
  getRecipes,
  deleteRecipe,
  updateRecipe,
  getRecipeAndSelect
}
