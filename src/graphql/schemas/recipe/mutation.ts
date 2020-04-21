import { gql } from 'apollo-server-express'

export default gql`
  #################################################
  #              MUTATION PAYLOADS
  #################################################

  type AddRecipePayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    recipe: Recipe
  }

  type UpdateRecipePayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    recipe: Recipe
  }

  type DeleteRecipePayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    recipe: Recipe
  }

  #################################################
  #                 MUTATIONS
  #################################################

  extend type Mutation {
    addRecipe(input: AddRecipeInput!): AddRecipePayload! @auth
    updateRecipe(input: UpdateRecipeInput!): UpdateRecipePayload! @auth
    deleteRecipe(input: DeleteRecipeInput!): DeleteRecipePayload! @auth
  }
`
