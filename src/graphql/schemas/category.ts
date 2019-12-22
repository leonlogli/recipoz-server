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

  type PagedCategories {
    categories: [Category!]
    totalItems: Int!
    page: Page!
  }

  input SubCategoryInput {
    type: SubCategoryType
    thumbnail: String
  }

  input CategoryInput {
    subCategory: SubCategoryInput
    name: I18nInput
    description: I18nInput
    thumbnail: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    category(id: ID!): Category!
    categoryBy(criteria: CategoryInput): Category!
    categories(criteria: String, sort: String): [Category!]!
    categoriesBy(criteria: CategoryInput, sort: String): [Category!]!
    pagedCategories(criteria: String, options: PageableInput): PagedCategories!
    pagedCategoriesBy(
      criteria: CategoryInput
      options: PageableInput
    ): PagedCategories!
  }

  extend type Mutation {
    addCategory(category: CategoryInput): Category!
    updateCategory(id: ID!, category: CategoryInput): Category!
    deleteCategory(id: ID!): Category!
  }
`
