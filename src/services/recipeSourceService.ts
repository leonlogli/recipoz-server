import { RecipeSource, RecipeSourceDocument } from '../models'
import { i18n, isDuplicateError, errorRes, locales } from '../utils'
import ModelService from './base/ModelService'
import followershipService from './followershipService'
import recipeService from './recipeService'
import { logger } from '../config'

const { statusMessages, errorMessages } = locales
const { created, deleted, updated } = statusMessages.recipeSource
const {
  notFound,
  nameAlreadyExists,
  websiteAlreadyExists
} = errorMessages.recipeSource

const recipeSourceModel = new ModelService<RecipeSourceDocument>({
  model: RecipeSource,
  onNotFound: notFound
})

const countRecipeSources = recipeSourceModel.countByBatch
const getRecipeSources = recipeSourceModel.findByIds
const getRecipeSourcesByBatch = recipeSourceModel.batchFind
const getRecipeSourceAndSelect = recipeSourceModel.findOne

const handleMutationError = (error: any) => {
  if (isDuplicateError(error) && error.errmsg.includes('name')) {
    return { success: false, message: i18n.t(nameAlreadyExists), code: 409 }
  }

  if (isDuplicateError(error) && error.errmsg.includes('website')) {
    return { success: false, message: i18n.t(websiteAlreadyExists), code: 409 }
  }

  return errorRes(error)
}

const addRecipeSource = async (input: any) => {
  try {
    const recipeSource = await recipeSourceModel.create(input)
    const message = i18n.t(created)

    return { success: true, message, code: 201, recipeSource }
  } catch (error) {
    return handleMutationError(error)
  }
}

const updateRecipeSource = async (input: any) => {
  try {
    const { id: _id, ...data } = input
    const recipeSource = await recipeSourceModel.update(_id, data)

    return { success: true, message: i18n.t(updated), code: 200, recipeSource }
  } catch (error) {
    return handleMutationError(error)
  }
}

const deleteRecipeSource = async (id: any) => {
  try {
    const recipeSource = await recipeSourceModel.delete(id)

    Promise.all([
      followershipService.deleteFollowers(id, 'RecipeSource'),
      recipeService.deleteSourceRecipes(id)
    ])
      .then(() => logger.info('Recipe source data deleted successfully'))
      .catch(e =>
        logger.error(`Error deleting recipe source (${id}) data: `, e)
      )

    return { success: true, message: i18n.t(deleted), code: 200, recipeSource }
  } catch (error) {
    return handleMutationError(error)
  }
}

export const recipeSourceService = {
  getRecipeSources,
  countRecipeSources,
  getRecipeSourcesByBatch,
  getRecipeSourceAndSelect,
  addRecipeSource,
  deleteRecipeSource,
  updateRecipeSource
}
export default recipeSourceService
