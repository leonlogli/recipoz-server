import categoryService from '../../services/categoryService'

export default {
  Query: {
    category: async (parent, { id }) => {
      return categoryService.getCategory(id)
    },
    categories: async (parent, { sort }) => {
      return categoryService.categories(sort)
    },
    pagedCategories: async (parent, { searchText, pageOptions, sort }) => {
      return categoryService.getCategories(searchText, pageOptions, sort)
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
