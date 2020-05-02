import { gql } from 'apollo-server-express'

export default gql`
  interface Node {
    id: ID!
  }

  extend type Query {
    node(id: ID!): Node
  }

  "Offset based page response"
  type Page {
    "Page number"
    number: Int!
    "Page size ie number of items per page"
    size: Int!
    "Total pages"
    count: Int!
  }

  "Cursor based page info"
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  enum Language {
    EN
    FR
  }

  #################################################
  #      DIRECTIVES
  #################################################

  """
  Require user to be authenticated and authorized with the specified role
  """
  directive @auth(requires: Role) on OBJECT | FIELD_DEFINITION

  """
  Build a global unique id (GUID) from mongoose _id field and its parent
  objectType (which is generally its model name).
  """
  directive @guid on FIELD_DEFINITION

  """
  Resolve i18n field to match the current language.
  Ex. 'title.en': 'val' becomes 'title': 'val'
  """
  directive @i18n on FIELD_DEFINITION
`
