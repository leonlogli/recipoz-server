import { categoryService } from '../../services'
import {
  buildFilterQuery,
  loadFollowersFromFollowerships,
  withClientMutationId,
  toLocalId
} from '../../utils'
import { validateCategory, validateCursorQuery } from '../../validations'
import { Context } from '../context'

export default {
  Query: {
    categories: (_: any, { filter, ...options }: any, ctx: Context) => {
      const criteria = buildFilterQuery(filter, { parent: 'Category' })
      const cursorQuery = validateCursorQuery(options)
      const { categoryByQueryLoader } = ctx.dataLoaders

      return categoryByQueryLoader.load({ ...cursorQuery, criteria })
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

      const category = validateCategory({ ...input, id }, false)
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
      const opts = validateCursorQuery(args)
      const { categoryByQueryLoader } = ctx.dataLoaders
      const criteria = { parent }

      return categoryByQueryLoader.load({ ...opts, criteria })
    },
    followers: async ({ _id }: any, args: any, { dataLoaders }: Context) => {
      const opts = validateCursorQuery(args)
      const criteria = { followedData: _id, followedDataType: 'Category' }
      const { followershipByQueryLoader: loader } = dataLoaders

      return loader.load({ ...opts, criteria }).then(followership => {
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
