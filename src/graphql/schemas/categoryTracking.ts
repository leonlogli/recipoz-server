import { gql } from 'apollo-server-express'

export default gql`
  type CategoryTracking {
    id: ID!
    user: ID!
    category: ID!
    viewCount: Int
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    categoryTracking(id: ID!): CategoryTracking!
    categoryTrackings: [CategoryTracking!]!
  }

  extend type Mutation {
    incrementCategoryView(user: ID!, category: ID!): CategoryTracking!
    deleteCategoryTracking(id: ID!): ID!
  }
`
