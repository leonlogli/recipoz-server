import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    recipes(
      author: ID
      orderBy: RecipeOrderBy
      first: Int
      after: String
      last: Int
      before: String
    ): RecipeConnection!
    favoriteRecipes(
      account: ID!
      first: Int
      after: String
      last: Int
      before: String
    ): RecipeConnection!
    madeRecipes(
      account: ID!
      first: Int
      after: String
      last: Int
      before: String
    ): RecipeConnection!
  }
`
