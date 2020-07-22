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
    isFollowed: async ({ _id }: any, _: any, ctx: Context) => {
      const { dataLoaders, accountId } = ctx
      const { followershipCountLoader } = dataLoaders
      const criteria = {
        followedDataType: 'RecipeSource',
        followedData: _id,
        follower: accountId
      }

      return followershipCountLoader.load(criteria).then(count => count > 0)
    },
    followers: async ({ _id }: any, args: any, { dataLoaders }: Context) => {
      const criteria = { followedData: _id, followedDataType: 'RecipeSource' }
      const query = validateCursorQuery({ ...args, criteria })
      const { followershipByQueryLoader } = dataLoaders

      return followershipByQueryLoader.load(query).then(followership => {
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
