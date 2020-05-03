import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    comments(
      topic: ID!
      orderBy: CommentOrderBy
      first: Int
      after: String
      last: Int
      before: String
    ): CommentConnection!
  }
`
