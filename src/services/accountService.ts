import { ADMIN_EMAIL, logger } from '../config'
import { errorMessages, statusMessages, USER, ADMIN } from '../constants'
import { Account, UserDocument, AccountDocument } from '../models'
import {
  DataLoaders,
  i18n,
  handleFirebaseError,
  isDuplicateError
} from '../utils'
import { ModelService } from './base'
import followershipService from './followershipService'
import notificationService from './notificationService'
import commentService from './commentService'
import commentReactionService from './commentReactionService'
import recipeService from './recipeService'
import shoppingListService from './shoppingListService'
import abuseReportService from './abuseReportService'
import savedRecipeService from './savedRecipeService'
import { fcmService, userService } from './firebase'
import recipeCollectionService from './recipeCollectionService'

const { notFound, alreadyExists, userNotFound } = errorMessages.account
const { created, deleted, updated } = statusMessages.account

const accountModel = new ModelService<AccountDocument>({
  model: Account,
  onNotFound: notFound
})

const countAccounts = accountModel.countByBatch
const getAccounts = accountModel.findByIds
const getAccountsByBatch = accountModel.batchFind
const getAccountAndSelect = accountModel.findOne
const getAccountsAndSelect = accountModel.findAndSelect

const addAccount = async (user: UserDocument) => {
  const message = i18n.t(created)

  if (user.email === ADMIN_EMAIL?.toLowerCase()) {
    await userService.setRoles(user.uid, USER, ADMIN)
  } else await userService.setRoles(user.uid, USER)

  const account = await accountModel.create({ user: user.uid })

  await userService.updateUser(account.user as any, {
    language: i18n.currentLanguage
  })

  return { success: true, message, code: 201, account }
}

const handleMutationError = (error: any) => {
  if (isDuplicateError(error)) {
    return { success: false, message: i18n.t(alreadyExists), code: 409 }
  }

  return handleFirebaseError(error)
}

const addAccountForNewUser = async (newUser: any) => {
  return userService
    .createUser(newUser)
    .then(user => addAccount(user))
    .catch(handleMutationError)
}

const addAccountForExistingUser = async (idToken: string) => {
  try {
    const { uid } = await userService.verifyIdToken(idToken)
    const user = await userService.getUserById(uid)

    if (!user) {
      return { success: true, message: i18n.t(userNotFound), code: 404 }
    }

    return await addAccount(user)
  } catch (error) {
    return handleMutationError(error)
  }
}

const updateAccount = async (input: any, loaders?: DataLoaders) => {
  try {
    const { id, user, ...data } = input
    const account = await accountModel.update(id, data, loaders)

    await userService.updateUser(account.user as any, user, loaders)

    return { success: true, message: i18n.t(updated), code: 200, account }
  } catch (error) {
    return handleMutationError(error)
  }
}

const addRegistrationToken = async (accountId: any, token: string) => {
  try {
    if (!token.trim() || !(await fcmService.isValidFCMToken(token))) {
      return { success: 0, message: 'Invalid registration token', code: 400 }
    }
    const query = { _id: accountId, registrationTokens: { $nin: [token] } }
    const data = { $push: { registrationTokens: token } }
    const account = await accountModel.updateOne(query, data)

    return { success: true, message: i18n.t(updated), code: 200, account }
  } catch (error) {
    return handleMutationError(error)
  }
}

const deleteAccountRelatedData = async (account: AccountDocument) => {
  return Promise.all([
    userService.deleteUser(account.user as any),
    followershipService.deleteAccountFollowership(account._id),
    notificationService.deleteNotifications(account._id),
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

const deleteAccount = async (id: any) => {
  try {
    const account = await accountModel.delete(id)

    deleteAccountRelatedData(account)

    return { success: true, message: i18n.t(deleted), code: 200, account }
  } catch (error) {
    return handleMutationError(error)
  }
}

export const accountService = {
  getAccounts,
  getAccountsByBatch,
  countAccounts,
  addAccountForNewUser,
  addAccountForExistingUser,
  deleteAccount,
  updateAccount,
  getAccountAndSelect,
  getAccountsAndSelect,
  addRegistrationToken
}
export default accountService
