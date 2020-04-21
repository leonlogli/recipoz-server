import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    recipes(
      orderBy: RecipeOrderBy
      first: Int
      after: String
      last: Int
      before: String
    ): RecipeConnection!
  }
`
