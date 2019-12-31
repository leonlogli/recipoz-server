import gql from 'graphql-tag'

export const GET_CATEGORY = gql`
  query category($id: ID!) {
    category(id: $id) {
      name
      thumbnail
    }
  }
`

export const GET_CATEGORY_BY = gql`
  query categoryBy($criteria: CategoryInput) {
    categoryBy(criteria: $criteria) {
      id
      name
      thumbnail
    }
  }
`

export const GET_CATEGORIES_BY = gql`
  query categoriesBy($criteria: CategoryInput, $sort: String) {
    categoriesBy(criteria: $criteria, sort: $sort) {
      id
      name
      thumbnail
    }
  }
`

export const GET_PAGED_CATEGORIES_BY = gql`
  query pagedCategoriesBy($criteria: CategoryInput, $options: PageableInput) {
    pagedCategoriesBy(criteria: $criteria, options: $options) {
      categories {
        name
      }
      page {
        number
        count
        size
        totalItems
      }
    }
  }
`

export const GET_CATEGORIES = gql`
  query categories($criteria: String, $sort: String) {
    categories(criteria: $criteria, sort: $sort) {
      id
      name
      thumbnail
    }
  }
`

export const GET_PAGED_CATEGORIES = gql`
  query pagedCategories($criteria: String, $options: PageableInput) {
    pagedCategories(criteria: $criteria, options: $options) {
      categories {
        name
      }
      page {
        number
        count
        size
        totalItems
      }
    }
  }
`

export const ADD_CATEGORY = gql`
  mutation AddCategory($category: CategoryInput) {
    addCategory(category: $category) {
      id
      subCategory {
        type
      }
      name
      thumbnail
    }
  }
`

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $category: CategoryInput) {
    updateCategory(id: $id, category: $category) {
      id
      subCategory {
        type
      }
      name
      thumbnail
    }
  }
`

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
      subCategory {
        type
      }
      name
      thumbnail
    }
  }
`
