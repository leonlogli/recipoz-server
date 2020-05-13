import { Recipe, RecipeDocument, Followership } from '../models'
import {
  DataLoaders,
  i18n,
  OffsetPage,
  buildFilterQuery,
  errorRes,
  locales
} from '../utils'
import ModelService from './base/ModelService'
import { logger } from '../config'
import { notificationService } from './notification'

const { statusMessages, errorMessages } = locales
const { notFound } = errorMessages.recipe
const { created, deleted, updated } = statusMessages.recipe
const { t } = i18n

const { addNotifications, deleteNotifications } = notificationService

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

const addRecipeNotification = async (
  recipe: RecipeDocument,
  loaders: DataLoaders
) => {
  const followedDataType = recipe.source ? 'RecipeSource' : 'Account'
  const followedData = recipe.source ? recipe.source : recipe.author

  const query = { followedData, followedDataType } as const
  const docs = await Followership.find(query, 'follower', { lean: true }).exec()

  const followers = docs.map(doc => doc.follower)
  const msg = { code: 'RECIPES', data: recipe._id, dataType: 'Recipe' } as const

  return addNotifications(msg, followers, loaders)
}

const addRecipe = async (input: any, loaders: DataLoaders) => {
  try {
    if (input.source) {
      await loaders.recipeSourceLoader.load(input.author)
    }
    const recipe = await recipeModel.create(input)

    addRecipeNotification(recipe, loaders)

    return { success: true, message: t(created), code: 201, recipe }
  } catch (error) {
    return errorRes(error)
  }
}

const suitableErrorResponse = async (recipeId: any) => {
  const exists = await recipeModel.exists(recipeId)
  const message = t(exists ? errorMessages.forbidden : notFound)

  return { success: false, message, code: exists ? 403 : 404 }
}

const updateRecipe = async (data: any, loaders: DataLoaders) => {
  try {
    const { id: _id, author, ...input } = data
    const query = { _id, author }

    if (data.source) {
      await loaders.recipeSourceLoader.load(author)
    }
    const recipe = await recipeModel.updateOne(query, { $set: input })
    const res = { success: true, message: t(updated), code: 200, recipe }

    return recipe ? res : suitableErrorResponse(_id)
  } catch (error) {
    return errorRes(error)
  }
}

const deleteRecipe = async (input: any, isAdmin = false) => {
  try {
    const { author, id: _id } = input
    const query = { _id, ...(!isAdmin && { author }) }
    const recipe = await recipeModel.deleteOne(query)

    if (!recipe) {
      suitableErrorResponse(_id)
    }
    deleteNotifications({ data: _id, dataType: 'Recipe' })

    return { success: true, message: t(deleted), code: 200, recipe }
  } catch (error) {
    return errorRes(error)
  }
}

const deleteAccountRecipes = async (accountId: any) => {
  return Recipe.deleteMany({ author: accountId, source: { $exists: false } })
    .exec()
    .catch(e =>
      logger.error(`Error deleting account (${accountId}) recipes: `, e)
    )
}

const deleteSourceRecipes = async (recipeSourceId: any) => {
  return Recipe.deleteMany({ source: recipeSourceId })
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
