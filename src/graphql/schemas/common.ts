import { gql } from 'apollo-server-express'

export default gql`
  """
  Type for pagination, filtering and sorting information.
  """
  type Page {
    number: Int!
    size: Int!
    count: Int!
  }

  """
  Input type for pagination, filtering and sorting information.
  """
  input PageInput {
    number: Int
    size: Int
  }

  """
  Pageable query criteria options
  """
  input PagedQueryOptions {
    page: PageInput
    """
    Sort directives: Ex: "name title" for ASC and "-name -title" for DESC
    """
    sort: String
    """
    Filter criteria expressions. Any criteria expression is in the form 'field.operator:value'
    where operator is one of 'exists', 'gt', 'gte', 'lt', 'all', 'in', 'nin', 'ne', 'like',
    'size', 'eq', 'sw', 'ew' or any of these operatore prefixed by '!'
    Ex: ["quantity.lt:50", "title.like:cook", "name.in:Ahmed,John", "quantity.!gte:50"]
    """
    filter: [String]
  }

  """
  Query criteria options
  """
  input QueryOptions {
    sort: String
    """
    Filter criteria expressions. Any criteria expression is in the form 'field.operator:value'
    where operator is one of 'exists', 'gt', 'gte', 'lt', 'all', 'in', 'nin', 'ne', 'like',
    'size', 'eq', 'sw', 'ew' or any of these operatore prefixed by '!'
    Ex: ["quantity.lt:50", "title.like:cook", "name.in:Ahmed,John", "quantity.!gte:50"]
    """
    filter: [String]
  }

  """
  I18n support input type
  """
  input I18n {
    en: String
    fr: String
  }
`
