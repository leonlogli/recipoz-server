import { recipeSourceService } from '../../services'
import {
  loadFollowersFromFollowerships,
  withClientMutationId,
  toLocalId
} from '../../utils'
import { validateCursorQuery, validateRecipeSource } from '../../validations'
import { Context } from '../context'

export default {
  Query: {
    recipeSources: (_: any, args: any, ctx: Context) => {
      const cursorQuery = validateCursorQuery(args)
      const { recipeSourceByQueryLoader } = ctx.dataLoaders

      return recipeSourceByQueryLoader.load(cursorQuery)
    }
  },
  Mutation: {
    addRecipeSource: (_: any, { input }: any) => {
      const data = validateRecipeSource(input)
      const payload = recipeSourceService.addRecipeSource(data)

      return withClientMutationId(payload, input)
    },
    updateRecipeSource: (_: any, { input }: any) => {
      const { id } = toLocalId(input.id, 'RecipeSource')

      const data = validateRecipeSource({ ...input, id }, false)
      const payload = recipeSourceService.updateRecipeSource(data)

      return withClientMutationId(payload, input)
    },
    deleteRecipeSource: (_: any, { input }: any) => {
      const { id } = toLocalId(input.id, 'RecipeSource')
      const recipeSource = validateRecipeSource({ id }, false)
      const payload = recipeSourceService.deleteRecipeSource(recipeSource.id)

      return withClientMutationId(payload, input)
    }
  },
  RecipeSource: {
    followers: async ({ _id }: any, args: any, { dataLoaders }: Context) => {
      const opts = validateCursorQuery(args)
      const criteria = { followedData: _id, followedDataType: 'RecipeSource' }
      const { followershipByQueryLoader: loader } = dataLoaders

      return loader.load({ ...opts, criteria }).then(followership => {
        return loadFollowersFromFollowerships(followership, dataLoaders)
      })
    },
    recipes: async ({ _id }: any, args: any, ctx: Context) => {
      const opts = validateCursorQuery(args)
      const { recipeByQueryLoader } = ctx.dataLoaders

      return recipeByQueryLoader.load({ ...opts, criteria: { source: _id } })
    }
  },
  RecipeSourceConnection: {
    totalCount: ({ totalCount, query }: any, _: any, ctx: Context) => {
      const { recipeSourceCountLoader } = ctx.dataLoaders

      return totalCount || recipeSourceCountLoader.load(query.criteria)
    }
  }
}
