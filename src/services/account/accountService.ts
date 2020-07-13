import { ADMIN_EMAIL } from '../../config'
import { ADMIN, USER } from '../../constants'
import { Account, AccountDocument, Role, UserDocument } from '../../models'
import { DataLoaders, i18n, locales, dotify } from '../../utils'
import { ModelService } from '../base'
import { userService } from '../firebase'
import { isValidFCMToken } from '../firebase/fcmServiceBase'
import {
  deleteAccountRelatedData,
  handleMutationError
} from './accountServiceHelper'

const { statusMessages, errorMessages } = locales
const { notFound, userNotFound } = errorMessages.account
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
  const isRootAdmin = user.email === ADMIN_EMAIL?.toLowerCase()
  const roles: ReadonlyArray<Role> = isRootAdmin ? [USER, ADMIN] : [USER]

  await userService.setRoles(user.uid, ...roles)
  const account = await accountModel.create({ user: user.uid })
  const userDefaults = { languages: [i18n.currentLanguage] }

  await userService.updateUser(account.user as any, userDefaults)

  return { success: true, message: i18n.t(created), code: 201, account }
}

const addAccountForNewUser = async (newUser: any) => {
  return userService
    .createUser(newUser)
    .then(user => addAccount(user))
    .catch(handleMutationError)
}

const addAccountForExistingUser = async (idToken: string) => {
  try {
    const { uid, roles } = await userService.verifyIdToken(idToken)
    const user = await userService.getUserById(uid)

    if (!user) {
      return { success: true, message: i18n.t(userNotFound), code: 404 }
    }
    const res = await addAccount(user)

    const accessToken = userService.generateAccessToken({
      id: res.account._id,
      roles
    })

    return { ...res, accessToken }
  } catch (error) {
    return handleMutationError(error)
  }
}

const updateAccount = async (input: any, loaders?: DataLoaders) => {
  try {
    const { id, user, ...data } = input
    const { notificationSettings, household, mealTimes, ...others } = data
    const dottedKeys = dotify({ notificationSettings, household, mealTimes })

    const set = { ...others, ...dottedKeys }
    const account = await accountModel.update(id, set, loaders)

    if (user) {
      await userService.updateUser(account.user as any, user, loaders)
    }

    return { success: true, message: i18n.t(updated), code: 200, account }
  } catch (error) {
    return handleMutationError(error)
  }
}

const addRegistrationToken = async (accountId: any, token: string) => {
  try {
    if (!token.trim() || !(await isValidFCMToken(token))) {
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
