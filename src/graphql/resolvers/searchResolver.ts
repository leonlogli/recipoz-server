import { categoryService, recipeService } from '../../services'
import { validateOffsetPage } from '../../validations'
import { Context } from '../context'

export default {
  Query: {
    search: (_: any, args: any, ctx: Context) => {
      const { query, type, filter, ...pageOpts } = args
      const _page = validateOffsetPage(pageOpts)

      if (type === 'CATEGORY') {
        return categoryService.search(query, _page, filter, ctx.dataLoaders)
      }

      return recipeService.search(query, _page, filter, ctx.dataLoaders)
    },
    autocomplete: (_: any, { query, type }: any) => {
      if (type === 'CATEGORY') {
        return categoryService.autocomplete(query)
      }

      return recipeService.autocomplete(query)
    }
  },
  Searchable: {
    __resolveType(data: any) {
      if (data.ingredients) {
        return 'Recipe'
      }

      if (data.name) {
        return 'Category'
      }

      return null
    }
  },
  SearchResult: {
    totalCount: ({ count }: any, _: any) => {
      return count
    },
    page: async ({ count, query }: any, _: any) => {
      count.then((totalCount: number) => {
        return {
          count: Math.ceil(totalCount / query.page.size),
          ...query.page
        }
      })
    }
  }
}
