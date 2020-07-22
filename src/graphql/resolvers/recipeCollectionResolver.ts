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
  validateRecipeCollection
} from '../../validations'
import { Context } from '../context'

export default {
  Query: {
    recipeCollections: (_: any, { account, ...opts }: any, ctx: Context) => {
      const { type, id } = toLocalId(account, 'Account')

      if (!type || !id) {
        return emptyConnection()
      }
      const query = validateCursorQuery({ ...opts, criteria: { account: id } })

      return ctx.dataLoaders.recipeCollectionByQueryLoader.load(query)
    },
    myRecipeCollections: (_: any, { ...opts }: any, ctx: Context) => {
      const { dataLoaders, accountId: account } = ctx
      const query = validateCursorQuery({ ...opts, criteria: { account } })

      return dataLoaders.notificationByQueryLoader.load(query)
    }
  },
  Mutation: {
    addRecipeCollection: (_: any, { input }: any, ctx: Context) => {
      const { accountId: account, dataLoaders: loaders } = ctx
      const data = validateRecipeCollection({ ...input, account })
      const payload = recipeCollectionService.addCollection(data, loaders)

      return withClientMutationId(payload, input)
    },
    updateRecipeCollection: (_: any, { input }: any, ctx: Context) => {
      const { accountId: account, dataLoaders: loaders } = ctx
      const { id } = toLocalId(input.id, 'RecipeCollection')

      const value = { ...input, id, account }
      const data = validateRecipeCollection(value, false)
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

      const criteria = { account, recipeCollection: _id, ...filterQuery }
      const query = validateCursorQuery({ ...opts, criteria })
      const { savedRecipeByQueryLoader } = ctx.dataLoaders

      return savedRecipeByQueryLoader.load(query).then(savedRecipes => {
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
