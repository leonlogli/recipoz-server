import { utensilService } from '../../services'

export default {
  Query: {
    utensilById: async (parent, { id }) => {
      return utensilService.getUtensilById(id)
    },
    utensil: async (parent, { criteria, filter }) => {
      return utensilService.getUtensil(criteria, filter)
    },
    utensils: async (parent, { criteria, options }) => {
      return utensilService.getUtensils(criteria, options)
    },
    searchUtensils: async (parent, { criteria, options }) => {
      return utensilService.getUtensils(criteria, options)
    }
  },
  Mutation: {
    addUtensil: async (parent, { utensil }) => {
      return utensilService.addUtensil(utensil)
    },
    updateUtensil: async (parent, { id, utensil }) => {
      return utensilService.updateUtensil(id, utensil)
    },
    deleteUtensil: async (parent, { id }) => {
      return utensilService.deleteUtensil(id)
    }
  }
}
