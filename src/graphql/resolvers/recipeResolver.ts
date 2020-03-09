import { recipeService } from '../../services'
import { statusMessages } from '../../constants'
import { i18n, ForbiddenError } from '../../utils'
import { Context } from '..'
import { validatRecipe } from '../../validations'

export default {
  Query: {
    recipe: async (_: any, { id }: any) => {
      return recipeService.getRecipeById(id)
    },
    recipes: async (_: any, { query, options }: any) => {
      return recipeService.getRecipes(query, options)
    }
  },
  Mutation: {
    addRecipe: async (_: any, { recipe: data }: any, ctx: Context) => {
      const { isAdmin, accountId, dataLoaders } = ctx
      const newRecipe = validatRecipe({ ...data, author: accountId }, isAdmin)

      if (newRecipe.authorType === 'RecipeSource' && isAdmin) {
        // await to ensure if it is an existing recipe source
        await dataLoaders.recipeSourceLoader.load(data.source)
      }
      const recipe = await recipeService.addRecipe(newRecipe)
      const message = i18n.t(statusMessages.recipe.created)

      return { success: true, message, code: 201, recipe }
    },
    updateRecipe: async (_: any, { id, recipe: data }: any, ctx: Context) => {
      const { isAdmin, accountId } = ctx
      const foundRecipe = await recipeService.getRecipeAndSelect(
        { _id: id },
        'author'
      )

      if (foundRecipe?.author !== accountId && !isAdmin) {
        throw new ForbiddenError()
      }
      const value = validatRecipe({ ...data, author: accountId }, isAdmin)
      const recipe = await recipeService.updateRecipe(id, value)
      const message = i18n.t(statusMessages.recipe.updated)

      return { success: true, message, code: 200, recipe }
    },
    deleteRecipe: async (_: any, { id }: any, ctx: Context) => {
      const { isAdmin, accountId } = ctx
      let recipe: any = await recipeService.getRecipeAndSelect(
        { _id: id },
        'author'
      )

      if (recipe.author !== accountId && !isAdmin) {
        throw new ForbiddenError()
      }
      recipe = await recipeService.deleteRecipe(id)
      const message = i18n.t(statusMessages.recipe.deleted)

      return { success: true, message, code: 200, recipe }
    }
  }
}
