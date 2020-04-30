import gql from 'graphql-tag'

export const NODE = gql`
  query node($id: ID!) {
    node(id: $id) {
      id
      ... on Category {
        name
      }
    }
  }
`

export const GET_CATEGORIES = gql`
  query categories(
    $filter: CategoryFilter
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    categories(
      first: $first
      after: $after
      last: $last
      before: $before
      filter: $filter
    ) {
      edges {
        cursor
        node {
          id
          name
        }
      }
      nodes {
        id
        name
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`

export const ADD_CATEGORY = gql`
  mutation addCategory($input: AddCategoryInput!) {
    addCategory(input: $input) {
      code
      success
      message
      clientMutationId
      category {
        id
        name
      }
    }
  }
`

export const UPDATE_CATEGORY = gql`
  mutation updateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      code
      success
      message
      clientMutationId
      category {
        id
        name
      }
    }
  }
`

export const DELETE_CATEGORY = gql`
  mutation deleteCategory($input: DeleteCategoryInput!) {
    deleteCategory(input: $input) {
      code
      success
      message
      clientMutationId
      category {
        id
        name
      }
    }
  }
`
