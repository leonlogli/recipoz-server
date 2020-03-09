import { gql } from 'apollo-server-express'

export default gql`
  """
  Require user to be authenticated and authorized with the specified role.
  As any user has 'USER' role by default, even if this directive is applied
  without parameters, this requires the user to be at least authenticated
  """
  directive @auth(requires: Role = USER) on OBJECT | FIELD_DEFINITION

  """
  Each returned (mongoose) doc is leaned (so it has '_id' field instead of 'id' field).
  So instead of resolve '_id' to 'id' in each resolver, this directive to handle this.
  It injects the returned doc '_id' field to the annotated field (commonly 'id')
  """
  directive @id on FIELD_DEFINITION

  "Format i18n field to normal field (without language). Ex. 'title.en': 'val' becomes 'title': 'val'"
  directive @i18n on FIELD_DEFINITION

  "Page info"
  type Page {
    "Page number"
    number: Int!
    "Page size ie number of items per page"
    size: Int!
    "Total pages"
    count: Int!
  }

  "Page info input"
  input PageInput {
    "Page number"
    number: Int
    "Page size or items per page"
    size: Int
  }

  input I18n {
    en: String
    fr: String
  }

  "Query criteria options"
  input QueryOptions {
    """
    The language in which the query will be performed.
    If not specified, use the current language
    """
    language: String
    "Sort criteria: Ex: 'name -title' where name is sorted in ASC and 'title' in DESC"
    sort: String
    """
    Filter criteria expressions. Any criteria expression is in the form 'field.operator:value'
    where operator is one of 'exists', 'gt', 'gte', 'lt', 'all', 'in', 'nin', 'ne', 'like',
    'size', 'eq', 'sw', 'ew' or any of these operatore prefixed by '!'
    Ex: ["quantity.lt:50", "title.like:cook", "name.in:Ahmed,John", "quantity.!gte:50"]
    """
    filter: [String]
  }

  input Search {
    searchText: String!
    searchType: SearchType
  }

  enum SearchType {
    FULL_TEXT
    PARTIAL_TEXT
  }

  "Base interface for mutation response"
  interface MutationResponse {
    "Represents the HTTP status code of the data transfer."
    code: Int!
    "Indicates whether the mutation was successful. This allows a coarse check by the client to know if there were failures"
    success: Boolean!
    "A human-readable string that describes the result of the mutation"
    message: String!
  }
`
