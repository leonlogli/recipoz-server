import { logger } from '../../config'
import { AccountDocument } from '../../models'
import {
  handleFirebaseError,
  i18n,
  isDuplicateError,
  locales
} from '../../utils'
import abuseReportService from '../abuseReportService'
import { commentReactionService, commentService } from '../comment'
import { userService } from '../firebase'
import followershipService from '../followershipService'
import { notificationService } from '../notification'
import recipeCollectionService from '../recipeCollectionService'
import { recipeService } from '../recipe'
import savedRecipeService from '../savedRecipeService'
import { shoppingListService } from '../shoppingList'

const { alreadyExists } = locales.errorMessages.account

const handleMutationError = (error: any) => {
  if (isDuplicateError(error)) {
    return { success: false, message: i18n.t(alreadyExists), code: 409 }
  }

  return handleFirebaseError(error)
}

const deleteAccountRelatedData = async (account: AccountDocument) => {
  return Promise.all([
    userService.deleteUser(account.user as any),
    followershipService.deleteAccountFollowership(account._id),
    notificationService.deleteNotifications({ recipient: account._id }),
    commentService.deleteComments(account._id),
    commentReactionService.deleteCommentReactions(account._id),
    recipeService.deleteAccountRecipes(account._id),
    shoppingListService.clearShoppingList(account._id),
    abuseReportService.deleteAccountAbuseReports(account._id),
    savedRecipeService.deleteSavedRecipes(account._id),
    recipeCollectionService.deleteRecipeCollections(account._id)
  ])
    .then(() => logger.info('Account data deleted successfully: ', account))
    .catch(e =>
      logger.error(`Error deleting account (${account._id}) data: `, e)
    )
}

export { handleMutationError, deleteAccountRelatedData }
