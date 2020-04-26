import {
  RecipeCollection,
  RecipeCollectionDocument,
  SavedRecipe
} from '../models'
import {
  i18n,
  DataLoaders,
  errorRes,
  isDuplicateError,
  locales
} from '../utils'
import ModelService from './base/ModelService'
import { logger } from '../config'

const { statusMessages, errorMessages } = locales
const { notFound, alreadyExists } = errorMessages.recipeCollection
const { created, deleted, updated } = statusMessages.recipeCollection

const collectionModel = new ModelService<RecipeCollectionDocument>({
  model: RecipeCollection,
  onNotFound: notFound
})

const countRecipeCollections = collectionModel.countByBatch
const getRecipeCollections = collectionModel.findByIds
const getRecipeCollectionsByBatch = collectionModel.batchFind
const getRecipeCollectionAndSelect = collectionModel.findOne

const handleMutationError = (error: any) => {
  if (isDuplicateError(error)) {
    return { success: false, message: i18n.t(alreadyExists), code: 409 }
  }

  return errorRes(error)
}

const addCollection = async (input: any, loaders: DataLoaders) => {
  try {
    await loaders.accountLoader.load(input.account)
    const recipeCollection = await collectionModel.create(input)
    const message = i18n.t(created)

    return { success: true, message, code: 201, recipeCollection }
  } catch (error) {
    return handleMutationError(error)
  }
}

const suitableErrorResponse = async (collectionId: any) => {
  const exists = await collectionModel.exists(collectionId)
  const message = i18n.t(exists ? errorMessages.forbidden : notFound)

  return { success: false, message, code: exists ? 403 : 404 }
}

const updateCollection = async (input: any, loaders: DataLoaders) => {
  try {
    const { id: _id, account, ...data } = input
    const set = { $set: data }
    const doc = await collectionModel.updateOne({ _id, account }, set, loaders)

    if (!doc) {
      return suitableErrorResponse(_id)
    }
    const message = i18n.t(updated)

    return { success: true, message, code: 200, recipeCollection: doc }
  } catch (error) {
    return handleMutationError(error)
  }
}

const deleteCollection = async (input: any) => {
  try {
    const { id: _id, account } = input
    const recipeCollection = await collectionModel.deleteOne({ _id, account })

    if (!recipeCollection) {
      return suitableErrorResponse(_id)
    }
    SavedRecipe.deleteMany({ account, recipeCollection: _id })
      .exec()
      .catch(e => {
        logger.error(`Error deleting collection (${_id}) recipes: `, e)
      })

    return { success: 1, message: i18n.t(deleted), code: 200, recipeCollection }
  } catch (error) {
    return errorRes(error)
  }
}

const deleteRecipeCollections = async (accountId: string): Promise<any> => {
  return RecipeCollection.deleteMany({ account: accountId } as any)
    .exec()
    .catch(e => {
      logger.error(`Error deleting account (${accountId}) collection: `, e)
    })
}

export const recipeCollectionService = {
  getRecipeCollections,
  countRecipeCollections,
  getRecipeCollectionsByBatch,
  getRecipeCollectionAndSelect,
  addCollection,
  deleteCollection,
  updateCollection,
  deleteRecipeCollections
}
export default recipeCollectionService
