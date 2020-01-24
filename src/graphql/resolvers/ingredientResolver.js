import { ingredientService } from '../../services'

export default {
  Query: {
    ingredientById: async (parent, { id }) => {
      return ingredientService.getIngredientById(id)
    },
    ingredient: async (parent, { criteria, filter }) => {
      return ingredientService.getIngredient(criteria, filter)
    },
    ingredients: async (parent, { criteria, options }) => {
      return ingredientService.getIngredients(criteria, options)
    },
    searchIngredients: async (parent, { criteria, options }) => {
      return ingredientService.getIngredients(criteria, options)
    }
  },
  Mutation: {
    addIngredient: async (parent, { ingredient }) => {
      return ingredientService.addIngredient(ingredient)
    },
    updateIngredient: async (parent, { id, ingredient }) => {
      return ingredientService.updateIngredient(id, ingredient)
    },
    deleteIngredient: async (parent, { id }) => {
      return ingredientService.deleteIngredient(id)
    }
  }
}
