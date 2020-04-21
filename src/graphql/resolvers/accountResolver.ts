import { Context } from '..'
import { accountService } from '../../services'
import {
  buildFilterQuery,
  loadFollowersFromFollowerships,
  loadRecipesFromSavedRecipes,
  loadFollowingFromFollowerships,
  withClientMutationId,
  toLocalId,
  i18n
} from '../../utils'
import {
  validateAccount,
  validateUserRegister,
  validateCursorQuery
} from '../../validations'
import { errorMessages } from '../../constants'

const { forbidden } = errorMessages

export default {
  Query: {
    me: (_: any, __: any, { accountId, dataLoaders }: Required<Context>) => {
      return dataLoaders.accountLoader.load(accountId)
    },
    accounts: (_: any, args: any, ctx: Context) => {
      const cursorQuery = validateCursorQuery(args)
      const { accountByQueryLoader } = ctx.dataLoaders

      return accountByQueryLoader.load(cursorQuery)
    }
  },
  Mutation: {
    register: (_: any, { input }: any) => {
      const account = validateUserRegister(input)
      const payload = accountService.addAccountForNewUser(account)

      return withClientMutationId(payload, input)
    },
    addAccount: async (_: any, { input }: any) => {
      const payload = accountService.addAccountForExistingUser(input.idToken)

      return withClientMutationId(payload, input)
    },
    updateAccount: (_: any, { input }: any, { accountId }: Context) => {
      const data = validateAccount({ ...input, id: accountId })
      const payload = accountService.updateAccount(data)

      return withClientMutationId(payload, input)
    },
    addRegistrationToken: (_: any, { input }: any, { accountId }: Context) => {
      const { registrationToken: token } = input
      const payload = accountService.addRegistrationToken(accountId, token)

      return withClientMutationId(payload, input)
    },
    deleteAccount: (_: any, { input }: any, ctx: Required<Context>) => {
      const { isAdmin, accountId } = ctx
      let id = accountId

      if (input.id) {
        if (!isAdmin) {
          return { success: false, code: 403, message: i18n.t(forbidden) }
        }
        id = toLocalId(input.id, 'Account').id as any
      }
      const account = validateAccount({ id }, false)
      const payload = accountService.deleteAccount(account.id)

      return withClientMutationId(payload, input)
    }
  },
  Account: {
    user: ({ user }: any, _: any, { dataLoaders }: Context) => {
      return dataLoaders.userLoader.load(user)
    },
    followers: async ({ _id }: any, args: any, { dataLoaders }: Context) => {
      const opts = validateCursorQuery(args)
      const criteria = { followedDataType: 'Account', followedData: _id }
      const { followershipByQueryLoader: loader } = dataLoaders

      return loader.load({ ...opts, criteria }).then(followership => {
        return loadFollowersFromFollowerships(followership, dataLoaders)
      })
    },
    following: async ({ _id }: any, args: any, { dataLoaders }: Context) => {
      const { filter, ...opts } = args
      const { followingTypes: types } = filter
      const cursorQuery = validateCursorQuery(opts)
      const filterQuery = { ...(types && { followedDataType: { $in: types } }) }
      const criteria = { follower: _id, ...filterQuery }
      const { followershipByQueryLoader: loader } = dataLoaders

      return loader.load({ ...cursorQuery, criteria }).then(followership => {
        return loadFollowingFromFollowerships(followership, dataLoaders)
      })
    },
    favoriteRecipes: async ({ _id: account }: any, args: any, ctx: Context) => {
      const cursorQuery = validateCursorQuery(args)
      const criteria = { account, collectionType: 'FAVORITE' }
      const { savedRecipeByQueryLoader: loader } = ctx.dataLoaders

      return loader.load({ ...cursorQuery, criteria }).then(savedRecipes => {
        return loadRecipesFromSavedRecipes(savedRecipes, ctx.dataLoaders)
      })
    },
    savedRecipes: async ({ _id: account }: any, args: any, ctx: Context) => {
      const { filter, ...opts } = args
      const filterQuery = buildFilterQuery(filter)
      const cursorQuery = validateCursorQuery(opts)
      const criteria = { account, ...filterQuery }
      const { savedRecipeByQueryLoader: loader } = ctx.dataLoaders

      return loader.load({ ...cursorQuery, criteria }).then(savedRecipes => {
        return loadRecipesFromSavedRecipes(savedRecipes, ctx.dataLoaders)
      })
    },
    madeRecipes: async (root: any, args: any, { dataLoaders }: Context) => {
      const cursorQuery = validateCursorQuery(args)
      const criteria = { account: root._id, collectionType: 'MADE' }
      const { savedRecipeByQueryLoader: loader } = dataLoaders

      return loader.load({ ...cursorQuery, criteria }).then(savedRecipes => {
        return loadRecipesFromSavedRecipes(savedRecipes, dataLoaders)
      })
    },
    recipeCollections: async ({ _id }: any, args: any, ctx: Context) => {
      const { filter, ...opts } = args
      const filterQuery = buildFilterQuery(filter)
      const cursorQuery = validateCursorQuery(opts)
      const criteria = { account: _id, ...filterQuery }
      const { recipeCollectionByQueryLoader } = ctx.dataLoaders

      return recipeCollectionByQueryLoader.load({ ...cursorQuery, criteria })
    },
    personalRecipes: async ({ _id }: any, args: any, ctx: Context) => {
      const cursorQuery = validateCursorQuery(args)
      const criteria = { author: _id, authorType: 'Account' }
      const { recipeByQueryLoader } = ctx.dataLoaders

      return recipeByQueryLoader.load({ ...cursorQuery, criteria })
    },
    shoppingList: async ({ _id }: any, args: any, ctx: Context) => {
      const { filter, ...opts } = args
      const filterQuery = buildFilterQuery(filter)
      const cursorQuery = validateCursorQuery(opts)
      const criteria = { account: _id, ...filterQuery }
      const { shoppingListItemByQueryLoader } = ctx.dataLoaders

      return shoppingListItemByQueryLoader.load({ ...cursorQuery, criteria })
    }
  },
  AccountConnection: {
    totalCount: ({ totalCount, query }: any, _: any, ctx: Context) => {
      const { accountCountLoader } = ctx.dataLoaders

      return totalCount || accountCountLoader.load(query.criteria)
    }
  }
}
