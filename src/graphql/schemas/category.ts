import { gql } from 'apollo-server-express'

export default gql`
  type Category implements Node {
    id: ID! @guid
    name: String! @i18n
    description: String @i18n
    thumbnail: String!
    parent: Category
    subCategories(
      first: Int
      after: String
      last: Int
      before: String
    ): CategoryConnection!
    followers(
      first: Int
      after: String
      last: Int
      before: String
    ): AccountConnection!
  }

  type CategoryEdge {
    cursor: String!
    node: Category!
  }

  type CategoryConnection {
    edges: [CategoryEdge!]!
    nodes: [Category!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  input AddCategoryInput {
    name: String!
    description: String
    thumbnail: String!
    parent: ID
    language: Language!
    clientMutationId: String
  }

  input UpdateCategoryInput {
    id: ID!
    name: String
    description: String
    thumbnail: String
    parent: ID
    language: Language!
    clientMutationId: String
  }

  input DeleteCategoryInput {
    "ID of the category to delete"
    id: ID!
    clientMutationId: String
  }

  input CategoryFilter {
    or: [CategoryFilter!]
    and: [CategoryFilter!]
    nor: [CategoryFilter!]
    name: I18NFilter
    description: I18NFilter
    parent: IDFilter
  }

  type AddCategoryPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    category: Category
  }

  type UpdateCategoryPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    category: Category
  }

  type DeleteCategoryPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    category: Category
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    categories(
      filter: CategoryFilter
      first: Int
      after: String
      last: Int
      before: String
    ): CategoryConnection!
  }

  extend type Mutation {
    addCategory(input: AddCategoryInput!): AddCategoryPayload!
      @auth(requires: ADMIN)
    updateCategory(input: UpdateCategoryInput!): UpdateCategoryPayload!
      @auth(requires: ADMIN)
    deleteCategory(input: DeleteCategoryInput!): DeleteCategoryPayload!
      @auth(requires: ADMIN)
  }
`
