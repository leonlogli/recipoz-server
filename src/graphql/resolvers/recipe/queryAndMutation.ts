import { Context } from '../..'
import { recipeService } from '../../../services'
import {
  emptyConnection,
  loadRecipesFromSavedRecipes,
  toLocalId,
  withClientMutationId,
  hasFalsyValue
} from '../../../utils'
import { validateCursorQuery, validatRecipe } from '../../../validations'

export default {
  Query: {
    recipes: (_: any, args: any, ctx: Context) => {
      const { author: recipeAuthor, source: recipeSource, ...opts } = args
      const author = recipeAuthor && toLocalId(recipeAuthor, 'Account').id
      const source = recipeAuthor && toLocalId(recipeSource, 'RecipeSource').id
      const criteria = { author, source }

      if (hasFalsyValue(criteria)) {
        return emptyConnection()
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
      const { isAdmin, accountId: author, dataLoaders } = ctx
      const canSetSource = input.source && isAdmin
      const source = canSetSource && toLocalId(input.source, 'RecipeSource')
      const sourceLink = source && input.sourceLink

      const data = validatRecipe({ ...input, author, source, sourceLink })
      const payload = recipeService.addRecipe(data, dataLoaders)

      return withClientMutationId(payload, input)
    },
    updateRecipe: async (_: any, { input }: any, ctx: Context) => {
      const { isAdmin, accountId: author, dataLoaders } = ctx
      const { id } = toLocalId(input.id, 'Recipe')
      const canSetSource = input.source && isAdmin
      const source = canSetSource && toLocalId(input.source, 'RecipeSource')
      const sourceLink = source && input.sourceLink

      const inputToValidate = { ...input, author, source, sourceLink, id }
      const data = validatRecipe(inputToValidate, false)
      const payload = recipeService.updateRecipe(data, dataLoaders)

      return withClientMutationId(payload, input)
    },
    deleteRecipe: (_: any, { input }: any, ctx: Required<Context>) => {
      const { isAdmin, accountId: author } = ctx
      const { id } = toLocalId(input.id, 'Recipe')

      const data = validatRecipe({ ...input, author, id }, false)
      const payload = recipeService.deleteRecipe(data, isAdmin)

      return withClientMutationId(payload, input)
    }
  }
}
