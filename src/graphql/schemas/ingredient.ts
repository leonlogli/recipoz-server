import { gql } from 'apollo-server-express'

export default gql`
  type Ingredient {
    id: ID!
    name: String!
    description: String
    image: String
  }

  input IngredientInput {
    name: String
    description: String
    image: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    ingredient(id: ID!): Ingredient!
    ingredients: [Ingredient!]!
  }

  extend type Mutation {
    addIngredient(ingredient: IngredientInput): Ingredient!
    updateIngredient(id: ID!, ingredient: IngredientInput): Ingredient!
    deleteIngredient(id: ID!): ID!
  }
`
