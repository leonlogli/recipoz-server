import { logger } from '../../config'
import { Followership, Recipe, RecipeDocument } from '../../models'
import { DataLoaders } from '../../utils'
import { notificationService } from '../notification'

const { addNotifications } = notificationService

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

const deleteAccountRecipes = async (accountId: any) => {
  return Recipe.deleteMany({ author: accountId, source: { $exists: false } })
    .exec()
    .catch(e =>
      logger.error(`Error deleting account (${accountId}) recipes: `, e)
    )
}

const deleteSourceRecipes = async (recipeSourceId: any) => {
  try {
    await Recipe.deleteMany({ source: recipeSourceId })
  } catch (e) {
    logger.error(`Error deleting recipeSource (${recipeSourceId}) recipes: `, e)
  }
}

export { addRecipeNotification, deleteAccountRecipes, deleteSourceRecipes }
