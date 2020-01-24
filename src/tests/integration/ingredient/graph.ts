import gql from 'graphql-tag'

export const GET_INGREDIENT_BY_ID = gql`
  query ingredientById($id: ID!) {
    ingredientById(id: $id) {
      name
    }
  }
`

export const GET_INGREDIENT = gql`
  query ingredient($criteria: IngredientInput, $filter: [String]) {
    ingredient(criteria: $criteria, filter: $filter) {
      id
      name
    }
  }
`

export const GET_INGREDIENTS = gql`
  query ingredients($criteria: IngredientInput, $options: QueryOptions) {
    ingredients(criteria: $criteria, options: $options) {
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

export const SEARCH_INGREDIENTS = gql`
  query searchIngredients($criteria: Search!, $options: QueryOptions) {
    searchIngredients(criteria: $criteria, options: $options) {
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

export const ADD_INGREDIENT = gql`
  mutation addIngredient($ingredient: IngredientInput!) {
    addIngredient(ingredient: $ingredient) {
      id
      name
    }
  }
`

export const UPDATE_INGREDIENT = gql`
  mutation updateIngredient($id: ID!, $ingredient: IngredientInput!) {
    updateIngredient(id: $id, ingredient: $ingredient) {
      id
      name
    }
  }
`

export const DELETE_INGREDIENT = gql`
  mutation deleteIngredient($id: ID!) {
    deleteIngredient(id: $id) {
      id
      name
    }
  }
`
