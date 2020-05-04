import { followershipService } from '../../services'
import { Context } from '../context'
import {
  loadFollowingFromFollowerships,
  toLocalId,
  emptyConnection,
  withClientMutationId
} from '../../utils'
import { followedDataTypes } from '../../models'
import { validateCursorQuery, validateFollowership } from '../../validations'

export default {
  Query: {
    followers: (_: any, { account, ...opts }: any, ctx: Context) => {
      const { id } = toLocalId(account, 'Account')

      if (!id) {
        return emptyConnection()
      }
      const cursorQuery = validateCursorQuery(opts)
      const criteria = { followedData: id, followedDataType: 'Account' }
      const { followershipByQueryLoader: loader } = ctx.dataLoaders

      return loader.load({ ...cursorQuery, criteria }).then(savedRecipes => {
        return loadFollowingFromFollowerships(savedRecipes, ctx.dataLoaders)
      })
    },
    following: (_: any, args: any, { dataLoaders }: Context) => {
      const { account, followingTypes: types, ...opts } = args
      const { id } = toLocalId(account, 'Account')

      if (!id) {
        return emptyConnection()
      }
      const cursorQuery = validateCursorQuery(opts)
      const filterQuery = { ...(types && { followedDataType: { $in: types } }) }
      const criteria = { follower: id, ...filterQuery }
      const { followershipByQueryLoader: loader } = dataLoaders

      return loader.load({ ...cursorQuery, criteria }).then(savedRecipes => {
        return loadFollowingFromFollowerships(savedRecipes, dataLoaders)
      })
    }
  },
  Mutation: {
    follow: (_: any, { input }: any, ctx: Required<Context>) => {
      const { type, id } = toLocalId(input.data, ...followedDataTypes)
      const { dataLoaders: loaders, accountId: follower } = ctx

      const data = { follower, followedData: id, followedDataType: type }
      const followership = validateFollowership(data)
      const payload = followershipService.addFollowership(followership, loaders)

      return withClientMutationId(payload, input)
    },
    unfollow: (_: any, { input }: any, ctx: Required<Context>) => {
      const { type, id } = toLocalId(input.data, ...followedDataTypes)
      const { dataLoaders: loaders, accountId: follower } = ctx

      const data = { follower, followedData: id, followedDataType: type }
      const value = validateFollowership(data)
      const payload = followershipService.deleteFollowership(value, loaders)

      return withClientMutationId(payload, input)
    }
  },
  FollowingType: {
    CATEGORY: 'Category',
    RECIPESOURCE: 'RecipeSource',
    ACCOUNT: 'Account'
  },
  Following: {
    __resolveType: (data: any) => data.__typename
  }
}
