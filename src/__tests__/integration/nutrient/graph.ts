import gql from 'graphql-tag'

export const GET_NUTRIENT_BY_ID = gql`
  query nutrientById($id: ID!) {
    nutrientById(id: $id) {
      name
    }
  }
`

export const GET_NUTRIENT = gql`
  query nutrient($criteria: NutrientInput, $filter: [String]) {
    nutrient(criteria: $criteria, filter: $filter) {
      id
      name
    }
  }
`

export const GET_NUTRIENTS = gql`
  query nutrients($criteria: NutrientInput, $options: QueryOptions) {
    nutrients(criteria: $criteria, options: $options) {
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

export const SEARCH_NUTRIENTS = gql`
  query searchNutrients($criteria: Search!, $options: QueryOptions) {
    searchNutrients(criteria: $criteria, options: $options) {
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

export const ADD_NUTRIENT = gql`
  mutation addNutrient($nutrient: NutrientInput!) {
    addNutrient(nutrient: $nutrient) {
      id
      name
    }
  }
`

export const UPDATE_NUTRIENT = gql`
  mutation updateNutrient($id: ID!, $nutrient: NutrientInput!) {
    updateNutrient(id: $id, nutrient: $nutrient) {
      id
      name
    }
  }
`

export const DELETE_NUTRIENT = gql`
  mutation deleteNutrient($id: ID!) {
    deleteNutrient(id: $id) {
      id
      name
    }
  }
`
