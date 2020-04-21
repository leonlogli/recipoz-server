import { gql } from 'apollo-server-express'

export default gql`
  type FollowingEdge {
    cursor: String!
    node: Following!
  }

  type FollowingConnection {
    edges: [FollowingEdge!]!
    nodes: [Following!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  union Following = Category | RecipeSource | Account

  enum FollowingType {
    CATEGORY
    RECIPESOURCE
    ACCOUNT
  }

  input FollowingFilter {
    followingTypes: [FollowingType!]
  }

  type FollowPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    me: Account
    following: Following
  }

  type UnfollowPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    me: Account
    following: Following
  }

  input FollowInput {
    "ID of data to follow"
    data: ID!
    clientMutationId: String
  }

  input UnFollowInput {
    "ID of data to unfollow"
    data: ID!
    clientMutationId: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    followers(
      """
      ID of the data whose following will be fetched.
      Can be account id, recipe source id or category id
      """
      data: ID!
      filter: FollowingFilter
      first: Int
      after: String
      last: Int
      before: String
    ): AccountConnection!
    following(
      """
      ID of the account whose following will be fetched
      """
      account: ID!
      filter: FollowingFilter
      first: Int
      after: String
      last: Int
      before: String
    ): FollowingConnection!
  }

  extend type Mutation {
    follow(input: FollowInput!): FollowPayload! @auth
    unfollow(input: UnFollowInput!): UnfollowPayload! @auth
  }
`
