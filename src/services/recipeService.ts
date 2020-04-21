import { errorMessages, statusMessages } from '../constants'
import { Recipe, RecipeDocument } from '../models'
import {
  DataLoaders,
  i18n,
  OffsetPage,
  buildFilterQuery,
  errorRes
} from '../utils'
import ModelService from './base/ModelService'
import { logger } from '../config'

const { notFound } = errorMessages.recipe
const { created, deleted, updated } = statusMessages.recipe

const recipeModel = new ModelService<RecipeDocument>({
  autocompleteField: 'name',
  model: Recipe,
  onNotFound: notFound
})

const countRecipes = recipeModel.countByBatch
const getRecipes = recipeModel.findByIds
const getRecipesByBatch = recipeModel.batchFind
const getRecipeAndSelect = recipeModel.findOne
const autocomplete = recipeModel.autocompleteSearch

const search = (
  query: string,
  page: OffsetPage,
  filter?: any,
  loaders?: DataLoaders
) => {
  const filterQuery = buildFilterQuery(filter)

  return recipeModel.search(query, page, filterQuery, loaders)
}

const addRecipe = async (data: any, loaders: DataLoaders) => {
  try {
    if (data.authorType === 'RecipeSource') {
      await loaders.recipeSourceLoader.load(data.author)
    }
    const recipe = await recipeModel.create(data)
    const message = i18n.t(created)

    return { success: true, message, code: 201, recipe }
  } catch (error) {
    return errorRes(error)
  }
}

const suitableErrorResponse = async (recipeId: any) => {
  const exists = await recipeModel.exists(recipeId)
  const message = i18n.t(exists ? errorMessages.forbidden : notFound)

  return { success: false, message, code: exists ? 403 : 404 }
}

const updateRecipe = async (data: any, loaders: DataLoaders) => {
  try {
    const { id: _id, author, authorType, ...input } = data

    if (authorType === 'RecipeSource') {
      await loaders.recipeSourceLoader.load(author)
    }
    const query = { _id, author, authorType }
    const recipe = await recipeModel.updateOne(query, { $set: input })

    if (!recipe) {
      return suitableErrorResponse(_id)
    }

    return { success: true, message: i18n.t(updated), code: 200, recipe }
  } catch (error) {
    return errorRes(error)
  }
}

const deleteRecipe = async (input: any, isAdmin = false) => {
  try {
    const { author, id: _id, authorType } = input
    const query = { _id, ...(!isAdmin && { author, authorType }) }
    const recipe = await recipeModel.deleteOne(query)

    if (!recipe) {
      return suitableErrorResponse(_id)
    }

    return { success: true, message: i18n.t(deleted), code: 200, recipe }
  } catch (error) {
    return errorRes(error)
  }
}

const deleteAccountRecipes = async (accountId: string) => {
  return Recipe.deleteMany({ author: accountId, authorType: 'Account' } as any)
    .exec()
    .catch(e =>
      logger.error(`Error deleting account (${accountId}) recipes: `, e)
    )
}

const deleteSourceRecipes = async (recipeSourceId: string) => {
  return Recipe.deleteMany({
    author: recipeSourceId,
    authorType: 'RecipeSource'
  } as any)
    .exec()
    .catch(e =>
      logger.error(
        `Error deleting recipeSource (${recipeSourceId}) recipes: `,
        e
      )
    )
}

export const recipeService = {
  search,
  getRecipes,
  getRecipesByBatch,
  countRecipes,
  addRecipe,
  deleteRecipe,
  updateRecipe,
  getRecipeAndSelect,
  autocomplete,
  deleteAccountRecipes,
  deleteSourceRecipes
}
export default recipeService
