import { ADMIN_EMAIL } from '../config'
import { errorMessages, statusMessages } from '../constants'
import { Account, UserDocument, AccountDocument } from '../models'
import {
  DataLoaders,
  i18n,
  QueryOptions,
  accountMutationErrorHandler as handleMutationError,
  handleQueryRefKeys
} from '../utils'
import ModelService from './common/ModelService'
import userService from './userService'
import accountOperationsService from './accountOperationsService'

const { notFound } = errorMessages.account
const { created, deleted, updated } = statusMessages.account

const accountModel = new ModelService<AccountDocument>({
  model: Account,
  onNotFound: notFound
})

const accountOpService = accountOperationsService(accountModel)

const countAccountsByBatch = accountModel.countByBatch
const getAccount = accountModel.findByIds
const getAccountsByBatch = accountModel.batchFind
const getAccountAndSelect = accountModel.findOne

const getAccountByUserInfo = async (query: any, loaders?: DataLoaders) => {
  const user = await userService.getUser(query)

  if (loaders) {
    loaders.userLoader.prime(user.id, user)
  }

  return accountModel.findOne({ user: user.id })
}

const getAccounts = (query: any, opts: QueryOptions, loaders?: DataLoaders) => {
  handleQueryRefKeys(query, 'followers', 'favoriteRecipes', 'triedRrecipes')

  return accountModel.find(query, opts, loaders)
}

const addAccount = async (user: UserDocument) => {
  const message = i18n.t(created)

  if (user.email === ADMIN_EMAIL?.toLowerCase()) {
    await userService.setRoles(user.id, 'USER', 'ADMIN')
  } else await userService.setRoles(user.id, 'USER')

  const account = await accountModel.create({ user: user.id })

  await userService.updateUser(account.user as any, {
    language: i18n.currentLanguage
  })

  return { success: true, message, code: 201, account }
}

const addAccountForNewUser = async (newUser: any) => {
  return userService
    .createUser(newUser)
    .then(user => addAccount(user))
    .catch(handleMutationError)
}

const addAccountForExistingUser = async (userId: string) => {
  return userService
    .getUser({ id: userId })
    .then(user => addAccount(user))
    .catch(handleMutationError)
}

const updateAccount = async (id: any, data: any, loaders?: DataLoaders) => {
  try {
    const { user, ...others } = data
    const account: any = await accountModel.update(id, others, loaders)

    await userService.updateUser(account.user, user, loaders)

    return { success: true, message: i18n.t(updated), code: 200, account }
  } catch (error) {
    return handleMutationError(error)
  }
}

const deleteAccount = async (id: any, dataLoaders?: DataLoaders) => {
  try {
    const account: any = await accountModel.delete(id)
    const user = await userService.deleteUser(account.user)

    if (dataLoaders) {
      dataLoaders.userLoader.prime(user.id, user)
    }

    return { success: true, message: i18n.t(deleted), code: 200, account }
  } catch (error) {
    return handleMutationError(error)
  }
}

export default {
  getAccountByUserInfo,
  getAccounts,
  getAccount,
  getAccountsByBatch,
  countAccountsByBatch,
  addAccountForNewUser,
  addAccountForExistingUser,
  deleteAccount,
  updateAccount,
  getAccountAndSelect,
  ...accountOpService
}
