import { gql } from 'apollo-server-express'

export default gql`
  type Ingredient {
    id: ID!
    name: String!
    description: String
    image: String
  }

  type Ingredients {
    """
    Ingredient list
    """
    content: [Ingredient!]!
    page: Page
    totalElements: Int
  }

  input IngredientInput {
    name: I18n
    description: I18n
    image: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    ingredientById(id: ID!): Ingredient!
    ingredient(criteria: IngredientInput, filter: [String]): Ingredient!
    ingredients(criteria: IngredientInput, options: QueryOptions): Ingredients!
    searchIngredients(criteria: Search!, options: QueryOptions): Ingredients!
  }

  extend type Mutation {
    addIngredient(ingredient: IngredientInput!): Ingredient!
    updateIngredient(id: ID!, ingredient: IngredientInput!): Ingredient!
    deleteIngredient(id: ID!): Ingredient!
  }
`
