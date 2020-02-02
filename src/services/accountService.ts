import { ApolloError } from 'apollo-server-express'
import status from 'http-status'

import { ADMIN_EMAIL } from '../config'
import { errorMessages } from '../constants'
import { Account } from '../models'
import { dotify, i18n, QueryOptions } from '../utils'
import ModelService from './ModelService'
import userService, { AuthOptions } from './userService'

const {
  notFound: dataNotFound,
  deleteNotFound: dataToDeleteNotFound,
  updateNotFound: dataToUpdateNotFound,
  cannotFollowYourself
} = errorMessages.account

const accountModel = new ModelService({
  model: Account,
  docTransformOptions: {
    refDocs: []
  },
  errorMessages: { dataNotFound, dataToDeleteNotFound, dataToUpdateNotFound }
})

const getAccountById = async (id: any) => {
  return accountModel.findById(id)
}

const getAccount = async (criteria: any, filter = []) => {
  return accountModel.findOne(criteria, filter)
}

const getAccountByUserInfo = async (criteria: AuthOptions) => {
  const user = await userService.getUser(criteria)

  return getAccount({ user: user.id })
}

const getAccountAndSelect = async (criteria: any, fieldsToSelect: string) => {
  const account = await Account.findOne(criteria, fieldsToSelect, {
    lean: true
  }).exec()

  return account
}

const getAccounts = async (criteria: any, options: QueryOptions) => {
  return accountModel.find(criteria, options)
}

/**
 * Add new account for firebase existing user or new user. If the user uid is
 * specified, new account will be created for the existing user. Otherwise, if the
 * newUser is specified, new account will be created after registering the new user
 * @param userId Firebase existing user uid
 * @param newUser new user to register
 */
const addAccount = async (userId?: string, newUser?: any) => {
  const user: any =
    userId && !!userId.trim()
      ? await userService.getUser({ id: userId })
      : await userService.createUser(newUser)

  if (user.email === ADMIN_EMAIL?.toLowerCase()) {
    await userService.setUserRoles(user.id, 'USER', 'ADMIN')
  } else await userService.setUserRoles(user.id, 'USER')

  return accountModel.create({ user: user.id })
}

const addAccountForNewUser = async (newUser: any) => {
  return addAccount(undefined, newUser)
}

const addAccountForExistingUser = async (userId: any) => {
  return addAccount(userId)
}

const updateAccount = async (id: any, account: any) => {
  const { user, ...others } = account
  const updatedAccount: any = await accountModel.update(id, others)

  await userService.updateUser(updatedAccount.user, user)

  return updatedAccount
}

const deleteAccount = async (id: any) => {
  const deletedAccount: any = await accountModel.delete(id)

  await userService.deleteUser(deletedAccount.user)

  return deletedAccount
}

const toggleUpdate = (data: any, add: boolean) => {
  return add ? { $addToSet: dotify(data) } : { $pull: dotify(data) }
}

const updateFollowers = async (id: any, follower: any, add = true) => {
  const updatedAccount: any = await accountModel.updateOne(
    { _id: id },
    toggleUpdate({ followers: follower }, add)
  )

  return updatedAccount
}

const followAccount = async (id: any, account: any) => {
  if (id === account) {
    throw new ApolloError(i18n.t(cannotFollowYourself), status['400_NAME'])
  }
  await updateFollowers(account, id) // update the follower account

  return getAccountById(id)
}

const unFollowAccount = async (id: any, account: any) => {
  // update the follower account
  await updateFollowers(account, id)

  return getAccountById(id)
}

const updateFavoriteRecipes = async (id: any, recipe: any, add = true) => {
  return accountModel.updateOne(
    { _id: id },
    toggleUpdate({ favoriteRecipes: recipe }, add)
  )
}

const updateTriedRecipes = async (id: any, recipe: any, add = true) => {
  const updatedAccount: any = await accountModel.updateOne(
    { _id: id },
    toggleUpdate({ triedRrecipes: recipe }, add)
  )

  return updatedAccount
}

const updateTastes = async (id: any, category: any, add = true) => {
  const updatedAccount: any = await accountModel.updateOne(
    { _id: id },
    toggleUpdate({ tastes: category }, add)
  )

  return updatedAccount
}

export default {
  getAccountById,
  getAccount,
  getAccountByUserInfo,
  getAccounts,
  addAccountForNewUser,
  addAccountForExistingUser,
  deleteAccount,
  updateAccount,
  followAccount,
  unFollowAccount,
  updateFavoriteRecipes,
  updateTriedRecipes,
  updateTastes,
  getAccountAndSelect
}
