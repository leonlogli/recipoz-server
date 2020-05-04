import { gql } from 'apollo-server-express'

export default gql`
  type AddFavoriteRecipePayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    recipeCollection: RecipeCollection
    recipe: Recipe
  }

  type RemoveFavoriteRecipePayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    recipeCollection: RecipeCollection
    recipe: Recipe
  }

  type AddMadeRecipePayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    recipeCollection: RecipeCollection
    recipe: Recipe
  }

  type RemoveMadeRecipePayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    recipeCollection: RecipeCollection
    recipe: Recipe
  }

  type AddRecipeToCollectionPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    recipeCollection: RecipeCollection
    recipe: Recipe
  }

  type RemoveRecipeFromCollectionPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    recipeCollection: RecipeCollection
    recipe: Recipe
  }

  input AddFavoriteRecipeInput {
    recipe: ID!
    clientMutationId: String
  }

  input AddMadeRecipeInput {
    recipe: ID!
    clientMutationId: String
  }

  input RemoveMadeRecipeInput {
    recipe: ID!
    clientMutationId: String
  }

  input RemoveFavoriteRecipeInput {
    recipe: ID!
    clientMutationId: String
  }

  input AddRecipeToCollectionInput {
    recipe: ID!
    recipeCollection: ID!
    clientMutationId: String
  }

  input RemoveRecipeFromCollectionInput {
    recipe: ID!
    recipeCollection: ID!
    clientMutationId: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    savedRecipes(
      account: ID!
      collection: ID
      first: Int
      after: String
      last: Int
      before: String
    ): RecipeConnection!
    mySavedRecipes(
      collection: ID
      first: Int
      after: String
      last: Int
      before: String
    ): RecipeConnection! @auth
  }

  extend type Mutation {
    addFavoriteRecipe(
      input: AddFavoriteRecipeInput!
    ): AddFavoriteRecipePayload! @auth
    removeFavoriteRecipe(
      input: RemoveFavoriteRecipeInput!
    ): RemoveFavoriteRecipePayload! @auth
    addMadeRecipe(input: AddMadeRecipeInput!): AddMadeRecipePayload! @auth
    removeMadeRecipe(input: RemoveMadeRecipeInput!): RemoveMadeRecipePayload!
      @auth
    addRecipeToCollection(
      input: AddRecipeToCollectionInput!
    ): AddRecipeToCollectionPayload! @auth
    removeRecipeFromCollection(
      input: RemoveRecipeFromCollectionInput!
    ): RemoveRecipeFromCollectionPayload! @auth
  }
`
