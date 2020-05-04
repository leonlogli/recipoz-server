import { Context } from '..'
import { savedRecipeService } from '../../services'
import {
  loadRecipesFromSavedRecipes,
  toLocalId,
  emptyConnection,
  withClientMutationId
} from '../../utils'
import { validateCursorQuery, validateSavedRecipe } from '../../validations'

export default {
  Query: {
    savedRecipes: (_: any, args: any, { dataLoaders }: Context) => {
      const { collection, account, ...opts } = args
      const { id } = toLocalId(account, 'Account')

      if (!id) {
        return emptyConnection()
      }
      const cursorQuery = validateCursorQuery(opts)
      const recipeCollection = toLocalId(collection, 'RecipeCollection')
      const criteria = { account: id, recipeCollection }
      const { savedRecipeByQueryLoader: loader } = dataLoaders

      return loader.load({ ...cursorQuery, criteria }).then(savedRecipes => {
        return loadRecipesFromSavedRecipes(savedRecipes, dataLoaders)
      })
    },
    mySavedRecipes: (_: any, { collection, ...opts }: any, ctx: Context) => {
      const { accountId: account, dataLoaders } = ctx

      if (!account) {
        return emptyConnection()
      }
      const cursorQuery = validateCursorQuery(opts)
      const recipeCollection = toLocalId(collection, 'RecipeCollection')
      const criteria = { account, recipeCollection }
      const { savedRecipeByQueryLoader: loader } = dataLoaders

      return loader.load({ ...cursorQuery, criteria }).then(savedRecipes => {
        return loadRecipesFromSavedRecipes(savedRecipes, dataLoaders)
      })
    }
  },
  Mutation: {
    addFavoriteRecipe: (_: any, { input }: any, ctx: Required<Context>) => {
      const { id: recipe } = toLocalId(input.recipe, 'Recipe')
      const { dataLoaders: loaders, accountId: account } = ctx
      const data = validateSavedRecipe({ recipe, account })
      const payload = savedRecipeService.addFavoriteRecipe(data, loaders)

      return withClientMutationId(payload, input)
    },
    removeFavoriteRecipe: (_: any, { input }: any, ctx: Required<Context>) => {
      const { id: recipe } = toLocalId(input.recipe, 'Recipe')
      const { dataLoaders: loaders, accountId: account } = ctx
      const data = validateSavedRecipe({ recipe, account })
      const payload = savedRecipeService.removeFavoriteRecipe(data, loaders)

      return withClientMutationId(payload, input)
    },
    addMadeRecipe: (_: any, { input }: any, ctx: Required<Context>) => {
      const { id: recipe } = toLocalId(input.recipe, 'Recipe')
      const { dataLoaders: loaders, accountId: account } = ctx
      const data = validateSavedRecipe({ recipe, account })
      const payload = savedRecipeService.addMadeRecipe(data, loaders)

      return withClientMutationId(payload, input)
    },
    removeMadeRecipe: (_: any, { input }: any, ctx: Required<Context>) => {
      const { id: recipe } = toLocalId(input.recipe, 'Recipe')
      const { dataLoaders: loaders, accountId: account } = ctx
      const data = validateSavedRecipe({ recipe, account })
      const payload = savedRecipeService.removeMadeRecipe(data, loaders)

      return withClientMutationId(payload, input)
    },
    addRecipeToCollection: (_: any, { input }: any, ctx: Required<Context>) => {
      const { id: recipe } = toLocalId(input.recipe, 'Recipe')
      const collection = input.recipeCollection
      const { id: recipeCollection } = toLocalId(collection, 'RecipeCollection')
      const { dataLoaders: loaders, accountId: account } = ctx
      const data = validateSavedRecipe({ recipe, account, recipeCollection })
      const payload = savedRecipeService.addToCollection(data, loaders)

      return withClientMutationId(payload, input)
    },
    removeRecipeFromCollection: (_: any, { input }: any, ctx: Context) => {
      const { id: recipe } = toLocalId(input.recipe, 'Recipe')
      const collection = input.recipeCollection
      const { id: recipeCollection } = toLocalId(collection, 'RecipeCollection')
      const { dataLoaders: loaders, accountId: account } = ctx
      const data = validateSavedRecipe({ recipe, account, recipeCollection })
      const payload = savedRecipeService.removeFromCollection(data, loaders)

      return withClientMutationId(payload, input)
    }
  }
}
