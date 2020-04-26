import { DataLoaders, i18n, errorRes, locales } from '../utils'
import { ModelService } from './base'
import {
  SavedRecipe,
  SavedRecipeDocument,
  RecipeCollectionType
} from '../models'
import { logger } from '../config'

const { statusMessages, errorMessages } = locales
const {
  addedToFavorite,
  addedToMade,
  removedFromFavorite,
  removedFromMade,
  addedToCollection,
  removedFromCollection
} = statusMessages.accountRecipe

const savedRecipeModel = new ModelService<SavedRecipeDocument>({
  model: SavedRecipe
})

const countSavedRecipesByBatch = savedRecipeModel.countByBatch
const getSavedRecipesByBatch = savedRecipeModel.batchFind

type Opts = {
  account: string
  recipe: string
  recipeCollection?: string
  collectionType?: RecipeCollectionType
}

const addToCustomCollection = async (input: Opts, loaders: DataLoaders) => {
  const { account, recipe: recipeId, recipeCollection: collectionId } = input
  const [recipe, recipeCollection] = await Promise.all([
    loaders.recipeLoader.load(recipeId),
    loaders.recipeCollectionLoader.load(collectionId as any),
    loaders.accountLoader.load(account)
  ])

  if (recipeCollection.account !== account) {
    return { success: 0, message: i18n.t(errorMessages.forbidden), code: 403 }
  }
  const query = { account, recipeCollection: collectionId, recipe: recipeId }

  await savedRecipeModel.createOrUpdate(query, { $set: query })
  const msg = i18n.t(addedToCollection, { collection: recipeCollection.name })

  return { success: true, message: msg, code: 404, recipeCollection, recipe }
}

const addToCollection = async (input: Opts, loaders: DataLoaders) => {
  try {
    const { account, recipe, collectionType, recipeCollection } = input

    if (recipeCollection) {
      return addToCustomCollection(input, loaders)
    }
    const [recipeDoc] = await Promise.all([
      loaders.recipeLoader.load(recipe),
      loaders.accountLoader.load(account)
    ])
    const query = { account, collectionType, recipe }

    await savedRecipeModel.createOrUpdate(query, { $set: query })
    const message = i18n.t(
      collectionType === 'FAVORITE' ? addedToFavorite : addedToMade
    )

    return { success: true, message, code: 200, recipe: recipeDoc }
  } catch (e) {
    return errorRes(e)
  }
}

const removeFromCustomCollection = async (opts: Opts, loaders: DataLoaders) => {
  const { account, recipe, recipeCollection: collection } = opts
  const [recipeDoc, recipeCollection] = await Promise.all([
    loaders.recipeLoader.load(recipe),
    loaders.recipeCollectionLoader.load(collection as any),
    loaders.accountLoader.load(account)
  ])
  const query = { account, recipeCollection: collection, recipe }

  await savedRecipeModel.deleteOne(query)
  const { name } = recipeCollection
  const message = i18n.t(removedFromCollection, { collection: name })

  return { success: 1, message, code: 200, recipeCollection, recipe: recipeDoc }
}

const removeFromCollection = async (input: Opts, loaders: DataLoaders) => {
  try {
    const { account, recipe, collectionType, recipeCollection } = input

    if (recipeCollection) {
      return removeFromCustomCollection(input, loaders)
    }
    const recipeDoc = await loaders.recipeLoader.load(recipe)

    await savedRecipeModel.deleteOne({ account, collectionType, recipe })
    const message = i18n.t(
      collectionType === 'FAVORITE' ? removedFromFavorite : removedFromMade
    )

    return { success: true, message, code: 200, account, recipe: recipeDoc }
  } catch (e) {
    errorRes(e)
  }
}

const addFavoriteRecipe = async (input: Opts, loaders: DataLoaders) => {
  return addToCollection({ ...input, collectionType: 'FAVORITE' }, loaders)
}

const addMadeRecipe = async (input: Opts, loaders: DataLoaders) => {
  return addToCollection({ ...input, collectionType: 'MADE' }, loaders)
}

const removeFavoriteRecipe = async (input: Opts, loaders: DataLoaders) => {
  return removeFromCollection({ ...input, collectionType: 'FAVORITE' }, loaders)
}

const removeMadeRecipe = async (input: Opts, loaders: DataLoaders) => {
  return removeFromCollection({ ...input, collectionType: 'MADE' }, loaders)
}

const deleteSavedRecipes = async (accountId: string) => {
  return SavedRecipe.deleteMany({ account: accountId } as any)
    .exec()
    .catch(e =>
      logger.error(`Error deleting account (${accountId}) saved recipes: `, e)
    )
}

export const savedRecipeService = {
  addToCollection,
  addFavoriteRecipe,
  removeFromCollection,
  getSavedRecipesByBatch,
  countSavedRecipesByBatch,
  deleteSavedRecipes,
  removeFavoriteRecipe,
  addMadeRecipe,
  removeMadeRecipe
}
export default savedRecipeService
