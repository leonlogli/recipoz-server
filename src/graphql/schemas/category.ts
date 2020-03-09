import { gql } from 'apollo-server-express'

export default gql`
  type Category {
    id: ID! @id
    name: String! @i18n
    description: String @i18n
    thumbnail: String
    parentCategory: Category
    subCategories(page: PageInput, sort: String): Categories!
  }

  input CategoryInput {
    name: String
    description: String
    thumbnail: String
    parentCategory: ID
  }

  type Categories {
    content: [Category!]!
    totalCount: Int!
    page: Page
  }

  type CategoryMutationResponse implements MutationResponse {
    code: Int!
    success: Boolean!
    message: String!
    category: Category
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    category(id: ID!): Category!
    categories(
      query: CategoryInput
      page: PageInput
      options: QueryOptions
    ): Categories!
    autocompleteCategories(query: String!): [String!]!
    searchCategories(query: String!, page: PageInput): Categories!
  }

  extend type Mutation {
    addCategory(category: CategoryInput!, language: String!): MutationResponse!
      @auth(requires: ADMIN)
    updateCategory(
      id: ID!
      category: CategoryInput!
      language: String!
    ): MutationResponse! @auth(requires: ADMIN)
    deleteCategory(id: ID!): MutationResponse! @auth(requires: ADMIN)
  }
`
