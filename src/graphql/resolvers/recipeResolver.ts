import { Context } from '..'
import { recipeService } from '../../services'
import {
  emptyConnection,
  loadRecipesFromSavedRecipes,
  toLocalId,
  withClientMutationId
} from '../../utils'
import { validateCursorQuery, validatRecipe } from '../../validations'

export default {
  Query: {
    recipes: (_: any, { author, ...opts }: any, ctx: Context) => {
      let criteria = {}

      if (author) {
        const { id, type } = toLocalId(author, 'Account', 'RecipeSource')

        if (!id) {
          return emptyConnection()
        }
        criteria = { author: id, authorType: type }
      }
      const cursorQuery = validateCursorQuery(opts)
      const { recipeByQueryLoader } = ctx.dataLoaders

      return recipeByQueryLoader.load({ ...cursorQuery, criteria })
    },
    favoriteRecipes: async (_: any, args: any, ctx: Context) => {
      const { account, ...opts } = args
      const { id } = toLocalId(account, 'Account')

      if (!id) {
        return emptyConnection()
      }
      const cursorQuery = validateCursorQuery(opts)
      const criteria = { account, collectionType: 'FAVORITE' }
      const { savedRecipeByQueryLoader: loader } = ctx.dataLoaders

      return loader.load({ ...cursorQuery, criteria }).then(savedRecipes => {
        return loadRecipesFromSavedRecipes(savedRecipes, ctx.dataLoaders)
      })
    },
    madeRecipes: async (root: any, args: any, { dataLoaders }: Context) => {
      const { account, ...opts } = args
      const { id } = toLocalId(account, 'Account')

      if (!id) {
        return emptyConnection()
      }
      const cursorQuery = validateCursorQuery(opts)
      const criteria = { account: root._id, collectionType: 'MADE' }
      const { savedRecipeByQueryLoader: loader } = dataLoaders

      return loader.load({ ...cursorQuery, criteria }).then(savedRecipes => {
        return loadRecipesFromSavedRecipes(savedRecipes, dataLoaders)
      })
    }
  },
  Mutation: {
    addRecipe: async (_: any, { input }: any, ctx: Required<Context>) => {
      const { isAdmin, accountId, dataLoaders } = ctx
      let author: any = { type: 'Account', id: accountId }

      if (input.source && isAdmin) {
        author = toLocalId(input.source, 'RecipeSource')
      }
      const authorInput = { author: author.id, authorType: author.type }
      const data = validatRecipe({ ...input, ...authorInput })
      const payload = recipeService.addRecipe(data, dataLoaders)

      return withClientMutationId(payload, input)
    },
    updateRecipe: async (_: any, { input }: any, ctx: Context) => {
      const { isAdmin, accountId, dataLoaders } = ctx
      const { id } = toLocalId(input.id, 'Recipe')
      let author: any = { type: 'Account', id: accountId }

      if (input.source && isAdmin) {
        author = toLocalId(input.source, 'RecipeSource')
      }
      const authorInput = { author: author.id, authorType: author.type }
      const data = validatRecipe({ ...input, ...authorInput, id }, false)
      const payload = recipeService.updateRecipe(data, dataLoaders)

      return withClientMutationId(payload, input)
    },
    deleteRecipe: (_: any, { input }: any, ctx: Required<Context>) => {
      const { isAdmin, accountId } = ctx
      const { id } = toLocalId(input.id, 'Recipe')
      let author: any = { type: 'Account', id: accountId }

      if (input.source && isAdmin) {
        author = toLocalId(input.source, 'RecipeSource')
      }
      const authorInput = { author: author.id, authorType: author.type }
      const data = validatRecipe({ ...input, ...authorInput, id }, false)
      const payload = recipeService.deleteRecipe(data)

      return withClientMutationId(payload, input)
    }
  }
}
