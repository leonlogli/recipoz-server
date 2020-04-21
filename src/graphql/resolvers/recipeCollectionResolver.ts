import { recipeCollectionService } from '../../services'
import {
  buildFilterQuery,
  loadRecipesFromSavedRecipes,
  withClientMutationId,
  toLocalId,
  emptyConnection
} from '../../utils'
import {
  validateCursorQuery,
  validateRecipeCollection as validateCollection,
  validateRecipeCollection
} from '../../validations'
import { Context } from '../context'

export default {
  Query: {
    recipeCollections: (_: any, { account, ...options }: any, ctx: Context) => {
      const { type, id } = toLocalId(account, 'Account')

      if (!type || !id) {
        return emptyConnection()
      }
      const criteria = { account: id }
      const cursorQuery = validateCursorQuery(options)
      const { recipeCollectionByQueryLoader } = ctx.dataLoaders

      return recipeCollectionByQueryLoader.load({ ...cursorQuery, criteria })
    },
    myRecipeCollections: (_: any, { ...opts }: any, ctx: Context) => {
      const criteria = { account: ctx.accountId }
      const cursorQuery = validateCursorQuery(opts)
      const { notificationByQueryLoader } = ctx.dataLoaders

      return notificationByQueryLoader.load({ ...cursorQuery, criteria })
    }
  },
  Mutation: {
    addRecipeCollection: (_: any, { input }: any, ctx: Context) => {
      const { accountId: account, dataLoaders: loaders } = ctx
      const data = validateCollection({ ...input, account })
      const payload = recipeCollectionService.addCollection(data, loaders)

      return withClientMutationId(payload, input)
    },
    updateRecipeCollection: (_: any, { input }: any, ctx: Context) => {
      const { accountId: account, dataLoaders: loaders } = ctx
      const { id } = toLocalId(input.id, 'RecipeCollection')

      const value = { ...input, id, account }
      const data = validateCollection(value, false)
      const payload = recipeCollectionService.updateCollection(data, loaders)

      return withClientMutationId(payload, input)
    },
    deleteRecipeCollection: (_: any, { input }: any, ctx: Context) => {
      const { id } = toLocalId(input.id, 'RecipeCollection')
      const { accountId: account } = ctx

      const data = validateRecipeCollection({ id, account }, false)
      const payload = recipeCollectionService.deleteCollection(data)

      return withClientMutationId(payload, input)
    }
  },
  RecipeCollection: {
    recipes: async ({ account, _id }: any, args: any, ctx: Context) => {
      const { filter, ...opts } = args
      const filterQuery = buildFilterQuery(filter)
      const cursorQuery = validateCursorQuery(opts)
      const criteria = { account, recipeCollection: _id, ...filterQuery }
      const { savedRecipeByQueryLoader: loader } = ctx.dataLoaders

      return loader.load({ ...cursorQuery, criteria }).then(savedRecipes => {
        return loadRecipesFromSavedRecipes(savedRecipes, ctx.dataLoaders)
      })
    }
  },
  RecipeCollectionConnection: {
    totalCount: ({ totalCount, query }: any, _: any, ctx: Context) => {
      const { recipeCollectionCountLoader } = ctx.dataLoaders

      return totalCount || recipeCollectionCountLoader.load(query.criteria)
    }
  }
}
