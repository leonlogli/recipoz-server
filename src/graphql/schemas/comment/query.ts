import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    comments(
      filter: CommentFilter!
      orderBy: CommentOrderBy
      first: Int
      after: String
      last: Int
      before: String
    ): CommentConnection!
  }
`
