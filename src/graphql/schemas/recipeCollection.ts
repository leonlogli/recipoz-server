import { gql } from 'apollo-server-express'

export default gql`
  type RecipeCollection implements Node {
    id: ID! @guid
    name: String!
    description: String
    private: Boolean!
    account: Account!
    "Recipes saved in this collection"
    recipes(
      first: Int
      after: String
      last: Int
      before: String
    ): RecipeConnection!
  }

  type RecipeCollectionEdge {
    cursor: String!
    node: RecipeCollection!
  }

  type RecipeCollectionConnection {
    edges: [RecipeCollectionEdge!]!
    nodes: [RecipeCollection!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type AddRecipeCollectionPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    recipeCollection: RecipeCollection
  }

  type UpdateRecipeCollectionPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    recipeCollection: RecipeCollection
  }

  type DeleteRecipeCollectionPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    recipeCollection: RecipeCollection
  }

  input AddRecipeCollectionInput {
    name: String!
    description: String
    private: Boolean
    clientMutationId: String
  }

  input UpdateRecipeCollectionInput {
    id: ID!
    name: String
    description: String
    private: Boolean
    clientMutationId: String
  }

  input DeleteRecipeCollectionInput {
    "ID of the collection to delete"
    id: ID!
    clientMutationId: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    recipeCollections(
      account: ID!
      first: Int
      after: String
      last: Int
      before: String
    ): RecipeCollectionConnection!
    myRecipeCollections(
      first: Int
      after: String
      last: Int
      before: String
    ): RecipeCollectionConnection! @auth
  }

  extend type Mutation {
    addRecipeCollection(
      input: AddRecipeCollectionInput!
    ): AddRecipeCollectionPayload! @auth
    updateRecipeCollection(
      input: UpdateRecipeCollectionInput!
    ): UpdateRecipeCollectionPayload! @auth
    deleteRecipeCollection(
      input: DeleteRecipeCollectionInput!
    ): DeleteRecipeCollectionPayload! @auth
  }
`
