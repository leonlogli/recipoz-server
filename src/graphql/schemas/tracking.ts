import { gql } from 'apollo-server-express'

export default gql`
  type Tracking {
    id: ID!
    user: Account!
    data: TrackingData
    viewCount: Int
  }

  union TrackingData = Category | Recipe

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    tracking(id: ID!): Tracking!
    trackings: [Tracking!]!
  }

  extend type Mutation {
    incrementDataViewCount(value: Int, data: ID!, user: ID): Tracking!
    deleteTracking(id: ID!): ID!
  }
`
