import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    me: Account! @auth
    accounts(
      first: Int
      after: String
      last: Int
      before: String
    ): AccountConnection!
  }
`
