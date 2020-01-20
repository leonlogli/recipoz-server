import { categoryService } from '../../services'

export default {
  Query: {
    category: async (parent, { id }) => {
      return categoryService.getCategoryById(id)
    },
    categoryBy: async (parent, { criteria, filter }) => {
      return categoryService.getCategory(criteria, filter)
    },
    categories: async (parent, { criteria, options }) => {
      return categoryService.getCategories(criteria, options)
    },
    categoriesBy: async (parent, { criteria, options }) => {
      return categoryService.getCategories(criteria, options)
    },
    pagedCategories: async (parent, { criteria, options }) => {
      return categoryService.getCategories(criteria, {
        ...options,
        page: options.page || {}
      })
    },
    pagedCategoriesBy: async (parent, { criteria, options }) => {
      return categoryService.getCategories(criteria, {
        ...options,
        page: options.page || {}
      })
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
