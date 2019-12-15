import { gql } from 'apollo-server-express'

export default gql`
  type RecipeSource {
    id: ID!
    name: String!
    url: String!
  }

  input RecipeSourceInput {
    name: String
    url: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    recipeSource(id: ID!): RecipeSource!
    recipeSources: [RecipeSource!]!
  }

  extend type Mutation {
    addRecipeSource(recipeSource: RecipeSourceInput): RecipeSource!
    updateRecipeSource(id: ID!, recipeSource: RecipeSourceInput): RecipeSource!
    deleteRecipeSource(id: ID!): ID!
  }
`
