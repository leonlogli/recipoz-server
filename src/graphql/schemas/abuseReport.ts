import { gql } from 'apollo-server-express'

export default gql`
  type AbuseReport {
    id: ID!
    type: AbuseType
    user: Account!
    onData: AbuseReportData
  }

  enum AbuseType {
    RUDE
    HARASSMENT
    ADULT_CONTENT
    HATE_SPEECH
    UNDESIRABLE_CONTENT
    VIOLENCE
    INTIMIDATION
    COPYRIGHT_ISSUE
    INAPPROPRIATE
  }

  union AbuseReportData = Category | Recipe

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    abuseReport(id: ID!): AbuseReport!
    abuseReports: [AbuseReport!]!
  }

  extend type Mutation {
    incrementDataViewCount(value: Int, data: ID!, user: ID): AbuseReport!
    deleteAbuseReport(id: ID!): ID!
  }
`
