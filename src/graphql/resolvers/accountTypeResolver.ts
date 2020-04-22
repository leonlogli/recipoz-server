import { Context } from '..'
import {
  buildFilterQuery,
  loadFollowersFromFollowerships,
  loadFollowingFromFollowerships,
  loadRecipesFromSavedRecipes
} from '../../utils'
import { validateCursorQuery } from '../../validations'
import { abuseReportDataTypes } from '../../models'

export default {
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
    },
    abuseReports: ({ _id: author }: any, args: any, ctx: Context) => {
      const cursorQuery = validateCursorQuery(args)
      const { dataLoaders: loaders } = ctx
      const criteria = { dataType: { $in: abuseReportDataTypes }, author }

      return loaders.abuseReportByQueryLoader.load({ ...cursorQuery, criteria })
    }
  },
  AccountConnection: {
    totalCount: ({ totalCount, query }: any, _: any, ctx: Context) => {
      const { accountCountLoader } = ctx.dataLoaders

      return totalCount || accountCountLoader.load(query.criteria)
    }
  }
}
