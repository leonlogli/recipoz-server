import { statusMessages } from '../constants'
import {
  accountMutationErrorHandler as handleMutationError,
  DataLoaders,
  i18n
} from '../utils'
import { ModelService } from './common'
import { AccountDocument } from '../models'

const { updated } = statusMessages.account
let accountModel: ModelService<AccountDocument>

const updateFollowers = async (
  id: string,
  follower: string,
  loaders: DataLoaders,
  add = true
) => {
  const me = loaders.accountLoader.load(follower)

  if (follower === id) {
    const message = 'Unprocessable Entity'

    return { success: false, message, code: 422, me, account: null }
  }

  try {
    const account = add
      ? accountModel.addDataToSet(id, { followers: follower })
      : accountModel.removeDataFromArray(id, { followers: follower })
    const message = i18n.t(updated)

    return { success: true, message, code: 200, me, account }
  } catch (error) {
    return handleMutationError(error, { me, account: null })
  }
}

const followAccount = (me: string, account: string, loaders: DataLoaders) => {
  return updateFollowers(account, me, loaders)
}

const unFollowAccount = (me: string, account: string, loaders: DataLoaders) => {
  return updateFollowers(account, me, loaders, false)
}

const updateFavoriteRecipes = async (
  id: string,
  recipe: string,
  loaders: DataLoaders,
  add = true
) => {
  try {
    await loaders.recipeLoader.load(recipe)
    const account = add
      ? accountModel.addDataToSet(id, { favoriteRecipes: recipe })
      : accountModel.removeDataFromArray(id, { favoriteRecipes: recipe })
    const message = i18n.t(updated)

    return { success: true, message, code: 200, account }
  } catch (error) {
    return handleMutationError(error)
  }
}

const updateTriedRecipes = async (
  id: string,
  recipe: string,
  loaders: DataLoaders,
  add = true
) => {
  await loaders.recipeLoader.load(recipe)
  try {
    const account = add
      ? accountModel.addDataToSet(id, { triedRrecipes: recipe })
      : accountModel.removeDataFromArray(id, { triedRrecipes: recipe })
    const message = i18n.t(updated)

    return { success: true, message, code: 200, account }
  } catch (error) {
    return handleMutationError(error)
  }
}

const updateTastes = async (
  id: string,
  taste: string,
  loaders: DataLoaders,
  add = true
) => {
  await loaders.categoryLoader.load(taste)
  try {
    const account = add
      ? accountModel.addDataToSet(id, { tastes: taste })
      : accountModel.removeDataFromArray(id, { tastes: taste })
    const message = i18n.t(updated)

    return { success: true, message, code: 200, account }
  } catch (error) {
    return handleMutationError(error)
  }
}

export default (_accountModel: ModelService<AccountDocument>) => {
  accountModel = _accountModel

  return {
    followAccount,
    unFollowAccount,
    updateFavoriteRecipes,
    updateTriedRecipes,
    updateTastes
  }
}
