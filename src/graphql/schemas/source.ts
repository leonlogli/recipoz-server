import { gql } from 'apollo-server-express'

export default gql`
  type Source {
    id: ID!
    name: String!
    website: String!
  }

  type Sources {
    """
    Source list
    """
    content: [Source!]!
    page: Page
    totalElements: Int
  }

  input SourceInput {
    name: String
    website: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    sourceById(id: ID!): Source!
    source(criteria: SourceInput, filter: [String]): Source!
    sources(criteria: SourceInput, options: QueryOptions): Sources!
    searchSources(criteria: Search!, options: QueryOptions): Sources!
  }

  extend type Mutation {
    addSource(source: SourceInput!): Source!
    updateSource(id: ID!, source: SourceInput!): Source!
    deleteSource(id: ID!): Source!
  }
`
