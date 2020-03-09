import { recipeSourceService } from '../../services'
import { Context } from '../context'
import { validateQueryOptions } from '../../validations'
import { validateRecipeSource } from '../../validations/source.validation'

export default {
  Query: {
    recipeSource: (_: any, { id }: any, { dataLoaders }: Context) => {
      return dataLoaders.recipeSourceLoader.load(id)
    },
    recipeSources: (_: any, { query, page, options }: any, ctx: Context) => {
      const opts = validateQueryOptions({ ...options, page })

      return recipeSourceService.getRecipeSources(query, opts, ctx.dataLoaders)
    }
  },
  Mutation: {
    addRecipeSource: (_: any, { source }: any) => {
      const data = validateRecipeSource(source)

      return recipeSourceService.addRecipeSource(data)
    },
    updateRecipeSource: (_: any, { id, source }: any) => {
      const data = validateRecipeSource(source)

      return recipeSourceService.updateRecipeSource(id, data)
    },
    deleteRecipeSource: (_: any, { id }: any) => {
      return recipeSourceService.deleteRecipeSource(id)
    },
    followRecipeSource: (_: any, { recipeSource }: any, ctx: Context) => {
      return recipeSourceService.followRecipeSource(
        ctx.accountId as string,
        recipeSource,
        ctx.dataLoaders
      )
    },
    unFollowRecipeSource: (_: any, { recipeSource }: any, ctx: Context) => {
      return recipeSourceService.unFollowRecipeSource(
        ctx.accountId as string,
        recipeSource,
        ctx.dataLoaders
      )
    }
  },
  RecipeSource: {
    followers: ({ followers }: any, args: any, ctx: Context) => {
      const { page, sort } = validateQueryOptions(args)
      const query = { criteria: { followers: { $in: followers } }, sort, page }
      const { recipeSourceByQueryLoader } = ctx.dataLoaders

      return { content: recipeSourceByQueryLoader.load(query), query }
    },
    recipes: ({ _id }: any, args: any, ctx: Context) => {
      const { page, sort } = validateQueryOptions(args)
      const criteria = { authorType: 'RecipeSource', author: _id }
      const query = { criteria, sort, page }
      const { recipeByQueryLoader } = ctx.dataLoaders

      return { content: recipeByQueryLoader.load(query), query }
    }
  },
  RecipeSources: {
    totalCount: ({ query }: any, _: any, { dataLoaders }: Context) => {
      return dataLoaders.recipeSourceCountLoader.load(query)
    },
    page: async ({ query }: any, _: any, { dataLoaders }: Context) => {
      const itemsCount = await dataLoaders.recipeSourceCountLoader.load(query)
      const pageCount = Math.ceil(itemsCount / query.page.size)

      return { count: pageCount, ...query.page }
    }
  }
}
