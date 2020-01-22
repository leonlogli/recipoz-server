import gql from 'graphql-tag'

export const GET_CATEGORY_BY_ID = gql`
  query categoryById($id: ID!) {
    categoryById(id: $id) {
      name
    }
  }
`

export const GET_CATEGORY = gql`
  query category($criteria: CategoryInput, $filter: [String]) {
    category(criteria: $criteria, filter: $filter) {
      id
      name
    }
  }
`

export const GET_CATEGORIES = gql`
  query categories($criteria: CategoryInput, $options: QueryOptions) {
    categories(criteria: $criteria, options: $options) {
      content {
        name
      }
      page {
        number
        count
        size
      }
      totalElements
    }
  }
`

export const SEARCH_CATEGORIES = gql`
  query searchCategories($criteria: Search!, $options: QueryOptions) {
    searchCategories(criteria: $criteria, options: $options) {
      content {
        name
      }
      page {
        number
        count
        size
      }
      totalElements
    }
  }
`

export const ADD_CATEGORY = gql`
  mutation addCategory($category: CategoryInput) {
    addCategory(category: $category) {
      id
      name
    }
  }
`

export const UPDATE_CATEGORY = gql`
  mutation updateCategory($id: ID!, $category: CategoryInput) {
    updateCategory(id: $id, category: $category) {
      id
      name
    }
  }
`

export const DELETE_CATEGORY = gql`
  mutation deleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
      name
    }
  }
`
