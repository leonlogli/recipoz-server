import { Context } from '../..'
import { commentService } from '../../../services'
import { loadAccountsFromSavedRecipes } from '../../../utils'
import { validateCursorQuery } from '../../../validations'

export default {
  RecipeOrderBy: {
    DATE_ASC: 'createdAt',
    DATE_DESC: '-createdAt'
  },
  Recipe: {
    author: ({ author }: any, _: any, { dataLoaders }: Context) => {
      return dataLoaders.accountLoader.load(author)
    },
    source: ({ source }: any, _: any, { dataLoaders }: Context) => {
      return source && dataLoaders.recipeSourceLoader.load(source)
    },
    readyIn: ({ cookTime, prepTime }: any) => {
      return (cookTime || 0) + (prepTime || 0)
    },
    categories: ({ categories }: any, _: any, { dataLoaders }: Context) => {
      return dataLoaders.categoryLoader.loadMany(categories)
    },
    rating: ({ _id: topic }: any, args: any, { dataLoaders }: Context) => {
      const criteria = { topic, topicType: 'Recipe' }

      return commentService.loadCommentRatingSummary(criteria, dataLoaders)
    },
    comments: ({ _id }: any, args: any, { dataLoaders: loaders }: Context) => {
      const criteria = { topic: _id, topicType: 'Recipe' }
      const cursorQuery = validateCursorQuery(args)

      return loaders.commentByQueryLoader.load({ ...cursorQuery, criteria })
    },
    isFavorite: async ({ _id: recipe }: any, _: any, ctx: Context) => {
      const { dataLoaders, accountId: account } = ctx
      const { savedRecipeCountLoader } = dataLoaders
      const criteria = { account, recipe, collectionType: 'FAVORITE' }

      return savedRecipeCountLoader.load(criteria).then(count => count > 0)
    },
    isMade: async ({ _id: recipe }: any, _: any, ctx: Context) => {
      const { dataLoaders, accountId: account } = ctx
      const { savedRecipeCountLoader } = dataLoaders
      const criteria = { account, recipe, collectionType: 'MADE' }

      return savedRecipeCountLoader.load(criteria).then(count => count > 0)
    },
    favoriteBy: async ({ _id }: any, args: any, { dataLoaders }: Context) => {
      const opts = validateCursorQuery(args)
      const criteria = { recipe: _id, collectionType: 'FAVORITE' }
      const { savedRecipeByQueryLoader: loader } = dataLoaders

      return loader.load({ ...opts, criteria }).then(savedRecipes => {
        return loadAccountsFromSavedRecipes(savedRecipes, dataLoaders)
      })
    },
    madeBy: ({ _id }: any, args: any, { dataLoaders }: Context) => {
      const opts = validateCursorQuery(args)
      const criteria = { recipe: _id, collectionType: 'MADE' }
      const { savedRecipeByQueryLoader: loader } = dataLoaders

      return loader.load({ ...opts, criteria }).then(savedRecipes => {
        return loadAccountsFromSavedRecipes(savedRecipes, dataLoaders)
      })
    }
  },
  RecipeConnection: {
    totalCount: ({ totalCount, query }: any, _: any, ctx: Context) => {
      const { recipeCountLoader } = ctx.dataLoaders

      return totalCount || recipeCountLoader.load(query.criteria)
    }
  }
}
