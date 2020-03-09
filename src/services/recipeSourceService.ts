import { errorMessages, statusMessages } from '../constants'
import { RecipeSource, RecipeSourceDocument } from '../models'
import {
  QueryOptions,
  DataLoaders,
  handleQueryRefKeys,
  i18n,
  recipeSourceMutationErrorHandler as handleMutationError
} from '../utils'
import ModelService from './common/ModelService'

const { notFound } = errorMessages.source
const { created, deleted, updated } = statusMessages.source

const recipeSourceModel = new ModelService<RecipeSourceDocument>({
  model: RecipeSource,
  onNotFound: notFound
})

const countSourcesByBatch = recipeSourceModel.countByBatch
const getSource = recipeSourceModel.findByIds
const getSourcesByBatch = recipeSourceModel.batchFind
const getSourceAndSelect = recipeSourceModel.findOne

const getRecipeSources = (
  query: any,
  opts: QueryOptions,
  loaders?: DataLoaders
) => {
  handleQueryRefKeys(query, 'followers')

  return recipeSourceModel.find(query, opts, loaders)
}

const addRecipeSource = async (data: any) => {
  try {
    const recipeSource = await recipeSourceModel.create(data)
    const message = i18n.t(created)

    return { success: true, message, code: 201, recipeSource }
  } catch (error) {
    return handleMutationError(error)
  }
}

const updateRecipeSource = async (id: any, data: any) => {
  try {
    const source = await recipeSourceModel.update(id, data)
    const message = i18n.t(updated)

    return { success: true, message, code: 200, source }
  } catch (error) {
    return handleMutationError(error)
  }
}

const deleteRecipeSource = async (id: any) => {
  try {
    const recipeSource = await recipeSourceModel.delete(id)
    const message = i18n.t(deleted)

    return { success: true, message, code: 200, recipeSource }
  } catch (error) {
    return handleMutationError(error)
  }
}

const updateFollowers = async (
  id: string,
  follower: string,
  loaders: DataLoaders,
  add = true
) => {
  const me = loaders.recipeSourceLoader.load(follower)

  try {
    const recipeSource = add
      ? recipeSourceModel.addDataToSet(id, { followers: follower })
      : recipeSourceModel.removeDataFromArray(id, { followers: follower })
    const message = i18n.t(updated)

    return { success: true, message, code: 200, me, recipeSource }
  } catch (error) {
    return handleMutationError(error, { me, recipeSource: null })
  }
}

const followRecipeSource = (
  me: string,
  recipeSource: string,
  loaders: DataLoaders
) => {
  return updateFollowers(recipeSource, me, loaders)
}

const unFollowRecipeSource = (
  me: string,
  recipeSource: string,
  loaders: DataLoaders
) => {
  return updateFollowers(recipeSource, me, loaders, false)
}

export const recipeSourceService = {
  getSource,
  getRecipeSources,
  countSourcesByBatch,
  getSourcesByBatch,
  getSourceAndSelect,
  addRecipeSource,
  followRecipeSource,
  unFollowRecipeSource,
  deleteRecipeSource,
  updateRecipeSource
}
export default recipeSourceService
