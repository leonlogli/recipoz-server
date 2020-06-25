import { gql } from 'apollo-server-express'

export default gql`
  type RecipeSource implements Node {
    id: ID! @guid
    name: String!
    website: String!
    logo: String!
    biography: String
    followers(
      first: Int
      after: String
      last: Int
      before: String
    ): AccountConnection!
    recipes(
      orderBy: RecipeOrderBy
      first: Int
      after: String
      last: Int
      before: String
    ): RecipeConnection!
  }

  type RecipeSourceEdge {
    cursor: String!
    node: RecipeSource!
  }

  type RecipeSourceConnection {
    edges: [RecipeSourceEdge!]!
    nodes: [RecipeSource!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  enum RecipeSourceOrderBy {
    CREATION_DATE_ASC
    CREATION_DATE_DESC
    UPDATE_DATE_ASC
    UPDATE_DATE_DESC
    NAME_ASC
    NAME_DESC
  }

  type AddRecipeSourcePayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    recipeSource: RecipeSource
  }

  type UpdateRecipeSourcePayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    recipeSource: RecipeSource
  }

  type DeleteRecipeSourcePayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    recipeSource: RecipeSource
  }

  input AddRecipeSourceInput {
    name: String!
    website: URL!
    logo: String!
    biography: String
    clientMutationId: String
  }

  input UpdateRecipeSourceInput {
    id: String!
    name: String
    website: URL
    logo: String
    biography: String
    clientMutationId: String
  }

  input DeleteRecipeSourceInput {
    "ID of the recipe source to delete"
    id: ID!
    clientMutationId: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    recipeSources(
      orderBy: RecipeSourceOrderBy
      first: Int
      after: String
      last: Int
      before: String
    ): RecipeSourceConnection!
  }

  extend type Mutation {
    addRecipeSource(input: AddRecipeSourceInput!): AddRecipeSourcePayload!
      @auth(requires: ADMIN)
    updateRecipeSource(
      input: UpdateRecipeSourceInput!
    ): UpdateRecipeSourcePayload! @auth(requires: ADMIN)
    deleteRecipeSource(
      input: DeleteRecipeSourceInput!
    ): DeleteRecipeSourcePayload! @auth(requires: ADMIN)
  }
`
