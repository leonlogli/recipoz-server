import { categoryService } from '../../services'

export default {
  Query: {
    category: async (parent, { id }) => {
      return categoryService.getCategoryById(id)
    },
    categoryBy: async (parent, { criteria }) => {
      return categoryService.getCategory(criteria)
    },
    categories: async (parent, { criteria, sort }) => {
      return categoryService.getCategories(criteria, { sort })
    },
    categoriesBy: async (parent, { criteria, sort }) => {
      return categoryService.getCategories(criteria, { sort })
    },
    pagedCategories: async (parent, { criteria, options }) => {
      return categoryService.getCategories(criteria, {
        ...options,
        paginate: true
      })
    },
    pagedCategoriesBy: async (parent, { criteria, options }) => {
      return categoryService.getCategories(criteria, {
        ...options,
        paginate: true
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
