import { nutrientService } from '../../services'

export default {
  Query: {
    nutrientById: async (parent, { id }) => {
      return nutrientService.getNutrientById(id)
    },
    nutrient: async (parent, { criteria, filter }) => {
      return nutrientService.getNutrient(criteria, filter)
    },
    nutrients: async (parent, { criteria, options }) => {
      return nutrientService.getNutrients(criteria, options)
    },
    searchNutrients: async (parent, { criteria, options }) => {
      return nutrientService.getNutrients(criteria, options)
    }
  },
  Mutation: {
    addNutrient: async (parent, { nutrient }) => {
      return nutrientService.addNutrient(nutrient)
    },
    updateNutrient: async (parent, { id, nutrient }) => {
      return nutrientService.updateNutrient(id, nutrient)
    },
    deleteNutrient: async (parent, { id }) => {
      return nutrientService.deleteNutrient(id)
    }
  }
}
