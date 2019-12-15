import { gql } from 'apollo-server-express'

export default gql`
  type Category {
    id: ID!
    subCategory: SubCategory!
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
    type: SubCategory!
    thumbnail: String
  }

  input CategoryInput {
    subCategory: SubCategory!
    name: String
    description: String
    thumbnail: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    category(id: ID!): Category!
    categories: [Category!]!
  }

  extend type Mutation {
    addCategory(category: CategoryInput): Category!
    updateCategory(id: ID!, category: CategoryInput): Category!
    deleteCategory(id: ID!): ID!
  }
`
