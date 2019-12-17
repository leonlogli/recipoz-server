import { gql } from 'apollo-server-express'

export default gql`
  type Category {
    id: ID!
    subCategory: SubCategory
    name: String!
    description: String
    thumbnail: String!
  }

  enum SubCategoryType {
    MEAL_TYPE
    DIET
    DISH_TYPE
    SEASONAL
    COOKING_STYLE
    HEALTH
    CUISINE
  }

  type SubCategory {
    type: SubCategoryType!
    thumbnail: String
  }

  type PageableCategories {
    categories: [Category!]
    page: Int
    pageCount: Int
  }

  input SubCategoryInput {
    type: SubCategoryType!
    thumbnail: String
  }

  input CategoryInput {
    subCategory: SubCategoryInput!
    name: String
    description: String
    thumbnail: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    category(id: ID!): Category!
    categories(sort: String): [Category!]
    pagedCategories(
      searchText: String
      pageOptions: PageableInput
      sort: String
    ): PageableCategories!
  }

  extend type Mutation {
    addCategory(category: CategoryInput): Category!
    updateCategory(id: ID!, category: CategoryInput): Category!
    deleteCategory(id: ID!): ID!
  }
`
