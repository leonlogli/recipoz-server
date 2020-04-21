import { gql } from 'apollo-server-express'

export default gql`
  "Supported filter expressions"
  input Filter {
    exists: Boolean
    gt: Float
    gte: Float
    lt: Float
    lte: Float
    all: [String!]
    in: [String!]
    nin: [String!]
    ne: String
    eq: String
    like: String
    """
    Modulo expression. Take an array of 2 elements: [ divisor, remainder ]
    The first argument is the dividend, and the second argument is the divisor
    i.e. first argument is divided by the second argument
    """
    mod: [Int]
    size: Int
    "Starts with"
    sw: String
    "Ends with"
    ew: String
  }

  "String field filter expressions"
  input StringFilter {
    exists: Boolean
    in: [String!]
    nin: [String!]
    ne: String
    eq: String
    like: String
    "Starts with"
    sw: String
    "Ends with"
    ew: String
  }

  "Boolean field filter expressions"
  input BooleanFilter {
    exists: Boolean
    ne: Boolean
    eq: Boolean
  }

  "Numeric field filter expressions"
  input NumFilter {
    exists: Boolean
    gt: Float
    gte: Float
    lt: Float
    lte: Float
    in: [Float!]
    nin: [Float!]
    ne: Float
    eq: Float
    """
    Modulo expression. Take an array of 2 elements: [ divisor, remainder ]
    The first argument is the dividend, and the second argument is the divisor
    i.e. first argument is divided by the second argument
    """
    mod: [Float]
  }

  "String array field filter expressions"
  input StringArrayFilter {
    exists: Boolean
    all: [String!]
    size: Int
    in: [String!]
    nin: [String!]
    ne: [String]
    eq: String
  }

  "Numeric array field filter expressions"
  input NumArrayFilter {
    exists: Boolean
    all: [Float!]
    size: Int
    in: [Float!]
    nin: [Float!]
    ne: [Float]
    eq: Float
  }

  input I18NFilter {
    fr: StringFilter
    en: StringFilter
  }

  """
  ID field filter expressions. Because we rely on this field to perform
  cursor based pagination, it can support only these filter expression
  """
  input IDFilter {
    in: [ID!]
    nin: [ID!]
    ne: ID
    eq: ID
  }

  """
  'OrderBy' string field filter expressions. Because we rely on this field to perform
  cursor based pagination, it can support only these filter expression
  """
  input OrderByStringFilter {
    in: [String!]
    nin: [String!]
    ne: String
    "Starts with"
    sw: String
    "Ends with"
    ew: String
  }

  """
  'OrderBy' number field filter expressions. Because we rely on this field to perform
  cursor based pagination, it can support only these filter expression
  """
  input OrderByNumFilter {
    in: [Float!]
    nin: [Float!]
    ne: Float
    eq: Float
  }
`
