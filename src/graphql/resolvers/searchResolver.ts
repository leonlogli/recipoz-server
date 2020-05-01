import { categoryService, recipeService } from '../../services'
import { validateOffsetPage } from '../../validations'
import { Context } from '../context'

export default {
  Query: {
    search: (_: any, args: any, { dataLoaders }: Context) => {
      const { query, type, filter, ...pageOpts } = args
      const page = validateOffsetPage(pageOpts)

      if (type === 'CATEGORY') {
        return categoryService.search(query, page, filter, dataLoaders)
      }

      return recipeService.search(query, page, filter, dataLoaders)
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
      return {
        count: Math.ceil((await count) / query.page.size),
        ...query.page
      }
    }
  }
}
