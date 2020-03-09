import { categoryService } from '../../services'
import { validateCategory, validateQueryOptions } from '../../validations'
import { Context } from '../context'

export default {
  Query: {
    category: (_: any, { id }: any, { dataLoaders }: Context) => {
      return dataLoaders.categoryLoader.load(id)
    },
    categories: (_: any, { query, options, page }: any, ctx: Context) => {
      const opts = validateQueryOptions({ ...options, page })
      const { language } = opts
      const value = validateCategory({ language, ...query }, false)

      return categoryService.getCategories(value, opts, ctx.dataLoaders)
    },
    searchCategories: (_: any, { query, page }: any) => {
      const opts = validateQueryOptions({ page })

      return categoryService.getCategories(query, opts)
    },
    autocompleteCategories: (_: any, { query }: any) => {
      return categoryService.autocomplete(query)
    }
  },
  Mutation: {
    addCategory: (_: any, args: any, { dataLoaders }: Context) => {
      const { language, category: data } = args
      const value = validateCategory({ language, ...data })

      return categoryService.addCategory(value, dataLoaders)
    },
    updateCategory: (_: any, args: any, ctx: Context) => {
      const { id, language, category: data } = args
      const value = validateCategory({ language, ...data }, false)

      return categoryService.updateCategory(id, value, ctx.dataLoaders)
    },
    deleteCategory: (_: any, { id }: any) => {
      return categoryService.deleteCategory(id)
    }
  },
  Category: {
    parentCategory: ({ parentCategory }: any, _: any, ctx: Context) => {
      const { categoryLoader } = ctx.dataLoaders

      return parentCategory && categoryLoader.load(parentCategory)
    },
    subCategories: ({ _id }: any, args: any, ctx: Context) => {
      const { page, sort } = validateQueryOptions(args)
      const query = { criteria: { parentCategory: _id }, sort, page }
      const { categoryByQueryLoader } = ctx.dataLoaders

      return { content: categoryByQueryLoader.load(query), query }
    }
  },
  Categories: {
    totalCount: ({ query }: any, _: any, { dataLoaders }: Context) => {
      return dataLoaders.categoryCountLoader.load(query)
    },
    page: async ({ query }: any, _: any, { dataLoaders }: Context) => {
      const itemsCount = await dataLoaders.categoryCountLoader.load(query)
      const pageCount = Math.ceil(itemsCount / query.page.size)

      return { count: pageCount, ...query.page }
    }
  }
}
