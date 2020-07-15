import { Context } from '../..'
import {
  buildFilterQuery,
  loadFollowersFromFollowerships,
  loadFollowingFromFollowerships,
  loadRecipesFromSavedRecipes,
  toLocalId
} from '../../../utils'
import { validateCursorQuery } from '../../../validations'
import { abuseReportDataTypes } from '../../../models'

export default {
  Account: {
    user: ({ user }: any, _: any, { dataLoaders }: Context) => {
      return dataLoaders.userLoader.load(user)
    },
    isOwner: async ({ _id }: any, _: any, ctx: Context) => {
      if (!ctx.isAuth) {
        return false
      }

      return String(ctx.accountId) === String(_id)
    },
    isFollowing: async (_parent: any, _: any, ctx: Context) => {
      if (!ctx.isAuth) {
        return false
      }
      const { dataLoaders, accountId } = ctx
      const { followershipCountLoader } = dataLoaders
      const criteria = { follower: accountId }

      return followershipCountLoader.load(criteria).then(count => count > 0)
    },
    followers: async ({ _id }: any, args: any, { dataLoaders }: Context) => {
      const criteria = { followedDataType: 'Account', followedData: _id }
      const query = validateCursorQuery({ ...args, criteria })
      const { followershipByQueryLoader } = dataLoaders

      return followershipByQueryLoader.load(query).then(followership => {
        return loadFollowersFromFollowerships(followership, dataLoaders)
      })
    },
    following: async ({ _id }: any, args: any, { dataLoaders }: Context) => {
      const { followingTypes: types, ...opts } = args
      const filterQuery = { ...(types && { followedDataType: { $in: types } }) }

      const criteria = { follower: _id, ...filterQuery }
      const query = validateCursorQuery({ ...opts, criteria })
      const { followershipByQueryLoader: loader } = dataLoaders

      return loader.load(query).then(followership => {
        return loadFollowingFromFollowerships(followership, dataLoaders)
      })
    },
    favoriteRecipes: async ({ _id: account }: any, args: any, ctx: Context) => {
      const criteria = { account, collectionType: 'FAVORITE' }
      const query = validateCursorQuery({ ...args, criteria })
      const { savedRecipeByQueryLoader } = ctx.dataLoaders

      return savedRecipeByQueryLoader.load(query).then(savedRecipes => {
        return loadRecipesFromSavedRecipes(savedRecipes, ctx.dataLoaders)
      })
    },
    madeRecipes: async (root: any, args: any, { dataLoaders }: Context) => {
      const criteria = { account: root._id, collectionType: 'MADE' }
      const query = validateCursorQuery({ ...args, criteria })
      const { savedRecipeByQueryLoader } = dataLoaders

      return savedRecipeByQueryLoader.load(query).then(savedRecipes => {
        return loadRecipesFromSavedRecipes(savedRecipes, dataLoaders)
      })
    },
    savedRecipes: async ({ _id: account }: any, args: any, ctx: Context) => {
      const { collection, ...opts } = args
      const recipeCollection = toLocalId(collection, 'RecipeCollection')
      const criteria = { account, recipeCollection }

      const query = validateCursorQuery({ ...opts, criteria })
      const { savedRecipeByQueryLoader: loader } = ctx.dataLoaders

      return loader.load(query).then(savedRecipes => {
        return loadRecipesFromSavedRecipes(savedRecipes, ctx.dataLoaders)
      })
    },
    recipeCollections: async ({ _id }: any, args: any, ctx: Context) => {
      const { filter, ...opts } = args
      const filterQuery = buildFilterQuery(filter)

      const criteria = { account: _id, ...filterQuery }
      const query = validateCursorQuery({ ...opts, criteria })

      return ctx.dataLoaders.recipeCollectionByQueryLoader.load(query)
    },
    personalRecipes: async ({ _id }: any, args: any, ctx: Context) => {
      const criteria = { author: _id, authorType: 'Account' }
      const query = validateCursorQuery({ ...args, criteria })

      return ctx.dataLoaders.recipeByQueryLoader.load(query)
    },
    shoppingList: async ({ _id }: any, args: any, ctx: Context) => {
      const { filter, ...opts } = args
      const filterQuery = buildFilterQuery(filter)
      const criteria = { account: _id, ...filterQuery }

      const query = validateCursorQuery({ ...opts, criteria })
      const { shoppingListItemByQueryLoader } = ctx.dataLoaders

      return shoppingListItemByQueryLoader.load(query)
    },
    abuseReports: ({ _id: author }: any, args: any, ctx: Context) => {
      const criteria = { dataType: { $in: abuseReportDataTypes }, author }
      const query = validateCursorQuery({ ...args, criteria })

      return ctx.dataLoaders.abuseReportByQueryLoader.load(query)
    }
  },
  AccountConnection: {
    totalCount: ({ totalCount, query }: any, _: any, ctx: Context) => {
      const { accountCountLoader } = ctx.dataLoaders

      return totalCount || accountCountLoader.load(query.criteria)
    }
  }
}
