import { gql } from 'apollo-server-express'

export default gql`
  type AbuseReport implements Node {
    id: ID! @guid
    type: AbuseType!
    author: Account!
    "The reported data"
    data: AbuseReportData!
    status: AbuseReportStatus!
    createdAt: String!
    updatedAt: String
  }

  enum AbuseReportOrderBy {
    DATE_ASC
    DATE_DESC
  }

  type AbuseReportEdge {
    cursor: String!
    node: AbuseReport!
  }

  type AbuseReportConnection {
    edges: [AbuseReportEdge!]!
    nodes: [AbuseReport!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  enum AbuseReportStatus {
    PENDING
    APPROVED
    IGNORED
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
    OTHER
  }

  union AbuseReportData = Comment | Recipe | Account

  type AddAbuseReportPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    abuseReport: AbuseReport
  }

  type UpdateAbuseReportPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    abuseReport: AbuseReport
  }

  type DeleteAbuseReportPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    abuseReport: AbuseReport
  }

  type ChangeDataAbuseReportsStatusPayload {
    code: String!
    "Returns true if 'mutatedCount' > 0, false otherwise"
    success: Boolean!
    message: String!
    clientMutationId: String
    "Number of abuse reports mutated (whose status is successfully updated)"
    mutatedCount: Int
  }

  input AddAbuseReportInput {
    type: AbuseType!
    "Id of data on which the abuse will be reported. It can be account id, comment id or recipe id"
    data: ID!
    clientMutationId: String
  }

  input UpdateAbuseReportInput {
    id: ID!
    type: AbuseType
    status: AbuseReportStatus
    clientMutationId: String
  }

  input ChangeDataAbuseReportsStatusInput {
    "Id of data on which the abuse is reported. It can be account id, comment id or recipe id"
    data: ID!
    "New status to set"
    status: AbuseReportStatus
    clientMutationId: String
  }

  input DeleteAbuseReportInput {
    "ID of the abuse report to delete"
    id: ID!
    clientMutationId: String
  }

  input AbuseReportFilter {
    or: [AbuseReportFilter!]
    and: [AbuseReportFilter!]
    nor: [AbuseReportFilter!]
    type: StringFilter
    status: StringFilter
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    myAbuseReports(
      orderBy: AbuseReportOrderBy
      first: Int
      after: String
      last: Int
      before: String
    ): AbuseReportConnection! @auth
    abuseReports(
      "ID of the reported data"
      data: ID
      filter: AbuseReportFilter
      orderBy: AbuseReportOrderBy
      first: Int
      after: String
      last: Int
      before: String
    ): AbuseReportConnection! @auth(requires: ADMIN)
  }

  extend type Mutation {
    addAbuseReport(input: AddAbuseReportInput!): AddAbuseReportPayload! @auth
    updateAbuseReport(
      input: UpdateAbuseReportInput!
    ): UpdateAbuseReportPayload! @auth
    deleteAbuseReport(
      input: DeleteAbuseReportInput!
    ): DeleteAbuseReportPayload! @auth
    "Change status for all abuse reports related to the specified data"
    changeDataAbuseReportsStatus(
      input: ChangeDataAbuseReportsStatusInput!
    ): ChangeDataAbuseReportsStatusPayload! @auth(requires: ADMIN)
  }
`
