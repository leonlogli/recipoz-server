import { gql } from 'apollo-server-express'

export default gql`
  enum SearchDataType {
    CATEGORY
    RECIPE
  }

  union Searchable = Category | Recipe

  type SearchResult {
    content: [Searchable!]!
    totalCount: Int!
    page: Page
  }

  input SearchFilter {
    category: [CategoryFilter!]
    recipe: [RecipeFilter!]
  }

  extend type Query {
    autocomplete(query: String!, type: SearchDataType!): [String!]!
    search(
      query: String!
      type: SearchDataType!
      filter: SearchFilter
      pageNumber: Int
      pageSize: Int
    ): SearchResult!
  }
`
