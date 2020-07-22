import { categoryService } from '../../services'
import {
  buildFilterQuery,
  loadFollowersFromFollowerships,
  withClientMutationId,
  toLocalId,
  i18n
} from '../../utils'
import { validateCategory, validateCursorQuery } from '../../validations'
import { Context } from '../context'

export default {
  Query: {
    categories: (_: any, { filter, ...options }: any, ctx: Context) => {
      const criteria = buildFilterQuery(filter, { parent: 'Category' })
      const query = validateCursorQuery({ ...options, criteria })
      const { categoryByQueryLoader } = ctx.dataLoaders

      return categoryByQueryLoader.load(query)
    }
  },
  Mutation: {
    addCategory: (_: any, { input }: any, { dataLoaders }: Context) => {
      const parent = input.parent && toLocalId(input.parent, 'Category').id

      const data = validateCategory({ ...input, parent })
      const payload = categoryService.addCategory(data, dataLoaders)

      return withClientMutationId(payload, input)
    },
    updateCategory: (_: any, { input }: any, { dataLoaders }: Context) => {
      const { id } = toLocalId(input.id, 'Category')
      const parent = input.parent && toLocalId(input.parent, 'Category').id

      const category = validateCategory({ ...input, id, parent }, false)
      const payload = categoryService.updateCategory(category, dataLoaders)

      return withClientMutationId(payload, input)
    },
    deleteCategory: (_: any, { input }: any) => {
      const { id } = toLocalId(input.id, 'Category')

      // We set manually language because it is required for validation but not required
      // to delete the category since the category id is the same for all languages
      const language = i18n.currentLanguage
      const category = validateCategory({ ...input, id, language }, false)
      const payload = categoryService.deleteCategory(category.id)

      return withClientMutationId(payload, input)
    }
  },
  Category: {
    parent: ({ parent }: any, _: any, ctx: Context) => {
      const { categoryLoader } = ctx.dataLoaders

      return parent && categoryLoader.load(parent)
    },
    subCategories: ({ _id: parent }: any, args: any, ctx: Context) => {
      const query = validateCursorQuery({ ...args, criteria: { parent } })
      const { categoryByQueryLoader } = ctx.dataLoaders

      return categoryByQueryLoader.load(query)
    },
    isFollowed: async ({ _id }: any, _: any, ctx: Context) => {
      const { dataLoaders, accountId } = ctx
      const { followershipCountLoader } = dataLoaders
      const criteria = {
        followedDataType: 'Category',
        followedData: _id,
        follower: accountId
      }

      return followershipCountLoader.load(criteria).then(count => count > 0)
    },
    followers: async ({ _id }: any, args: any, { dataLoaders }: Context) => {
      const criteria = { followedData: _id, followedDataType: 'Category' }
      const query = validateCursorQuery({ ...args, criteria })
      const { followershipByQueryLoader } = dataLoaders

      return followershipByQueryLoader.load(query).then(followership => {
        return loadFollowersFromFollowerships(followership, dataLoaders)
      })
    }
  },
  CategoryConnection: {
    totalCount: ({ totalCount, query }: any, _: any, ctx: Context) => {
      const { categoryCountLoader } = ctx.dataLoaders

      return totalCount || categoryCountLoader.load(query.criteria)
    }
  }
}
