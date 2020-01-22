import { categoryService } from '../../services'

export default {
  Query: {
    categoryById: async (parent, { id }) => {
      return categoryService.getCategoryById(id)
    },
    category: async (parent, { criteria, filter }) => {
      return categoryService.getCategory(criteria, filter)
    },
    categories: async (parent, { criteria, options }) => {
      return categoryService.getCategories(criteria, options)
    },
    searchCategories: async (parent, { criteria, options }) => {
      return categoryService.getCategories(criteria, options)
    }
  },
  Mutation: {
    addCategory: async (parent, { category }) => {
      return categoryService.addCategory(category)
    },
    updateCategory: async (parent, { id, category }) => {
      return categoryService.updateCategory(id, category)
    },
    deleteCategory: async (parent, { id }) => {
      return categoryService.deleteCategory(id)
    }
  }
}
