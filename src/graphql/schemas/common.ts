import { gql } from 'apollo-server-express'

export default gql`
  # Type for pagination and sorting information.
  input PageableInput {
    page: Int
    limit: Int
    sort: String
  }

  type Page {
    number: Int!
    size: Int!
    count: Int!
    totalItems: Int!
  }

  type I18n {
    en: String
    fr: String
  }

  input I18nInput {
    en: String
    fr: String
  }
`
