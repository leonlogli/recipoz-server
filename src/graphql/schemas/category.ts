import { gql } from 'apollo-server-express'

export default gql`
  type Category {
    id: ID!
    parentCategory: ParentCategory
    name: String!
    description: String
    thumbnail: String!
  }

  type ParentCategory {
    id: ID
    name: String
    description: String
    thumbnail: String
  }

  type Categories {
    """
    Category list
    """
    content: [Category!]!
    page: Page
    totalElements: Int
  }

  input CategoryInput {
    parentCategory: ID
    name: I18n
    description: I18n
    thumbnail: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    categoryById(id: ID!): Category!
    category(criteria: CategoryInput, filter: [String]): Category!
    categories(criteria: CategoryInput, options: QueryOptions): Categories!
    searchCategories(criteria: Search!, options: QueryOptions): Categories!
  }

  extend type Mutation {
    addCategory(category: CategoryInput!): Category!
    updateCategory(id: ID!, category: CategoryInput!): Category!
    deleteCategory(id: ID!): Category!
  }
`
