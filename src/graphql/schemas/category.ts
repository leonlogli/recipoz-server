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

  type PagedCategories {
    """
    list of categories on this page
    """
    content: [Category!]
    page: Page!
    totalElements: Int!
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
    category(id: ID!): Category!
    categoryBy(criteria: CategoryInput, filter: [String]): Category!
    categories(criteria: String, options: QueryOptions): [Category!]!
    categoriesBy(criteria: CategoryInput, options: QueryOptions): [Category!]!
    pagedCategories(
      criteria: String
      options: PagedQueryOptions
    ): PagedCategories!
    pagedCategoriesBy(
      criteria: CategoryInput
      options: PagedQueryOptions
    ): PagedCategories!
  }

  extend type Mutation {
    addCategory(category: CategoryInput): Category!
    updateCategory(id: ID!, category: CategoryInput): Category!
    deleteCategory(id: ID!): Category!
  }
`
