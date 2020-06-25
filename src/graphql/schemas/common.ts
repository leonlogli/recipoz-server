import { gql } from 'apollo-server-express'

export default gql`
  "An object with an ID"
  interface Node {
    "The id of the object"
    id: ID!
  }

  extend type Query {
    node(id: ID!): Node
  }

  extend type Mutation {
    "Delete cloudinary uploaded file"
    deleteUploadedFile(publicId: String): String @auth
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

  "Cursor based pagination info"
  type PageInfo {
    "When paginating forwards, indicates whether there are there more items"
    hasNextPage: Boolean!
    "When paginating backwards, indicates whether there are there more items"
    hasPreviousPage: Boolean!
    "When paginating backwards, the cursor to continue"
    startCursor: String
    "When paginating forwards, the cursor to continue"
    endCursor: String
  }

  "App supported languages"
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
  """
  directive @i18n on FIELD_DEFINITION
`
