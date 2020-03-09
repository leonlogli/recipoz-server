import { gql } from 'apollo-server-express'

export default gql`
  type RecipeSource {
    id: ID!
    name: String!
    website: String!
    logo: String
    coverImage: String
    about: String
    followers(page: PageInput, sort: String): RecipeSources!
    recipes(page: PageInput, sort: String): Recipes!
  }

  type RecipeSources {
    content: [RecipeSource!]!
    totalCount: Int!
    page: Page
  }

  input RecipeSourceInput {
    name: String
    website: String
    logo: String
    coverImage: String
    about: String
  }

  input RecipeSourceQuery {
    name: String
    website: String
    logo: String
    coverImage: String
    about: String
    followers: [ID!]
  }

  type RecipeSourceMutationResponse implements MutationResponse {
    code: Int!
    success: Boolean!
    message: String!
    RecipeSource: RecipeSource
  }

  type FollowRecipeSourceMutationResponse implements MutationResponse {
    code: Int!
    success: Boolean!
    message: String!
    me: RecipeSource!
    recipeSource: RecipeSource
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    recipeSource(id: ID!): RecipeSource!
    recipeSources(
      query: RecipeSourceQuery
      page: PageInput
      options: QueryOptions
    ): RecipeSources!
  }

  extend type Mutation {
    addRecipeSource(recipeSource: RecipeSourceInput!): MutationResponse!
    updateRecipeSource(
      id: ID!
      recipeSource: RecipeSourceInput!
    ): MutationResponse!
    deleteRecipeSource(id: ID!): MutationResponse!
    followRecipeSource(recipeSource: ID!): MutationResponse! @auth
    unFollowRecipeSource(recipeSource: ID!): MutationResponse! @auth
  }
`
