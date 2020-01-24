import { gql } from 'apollo-server-express'

export default gql`
  type Nutrient {
    id: ID!
    name: String!
    code: String!
  }

  type Nutrients {
    """
    Nutrient list
    """
    content: [Nutrient!]!
    page: Page
    totalElements: Int
  }

  input NutrientInput {
    name: I18n
    code: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    nutrientById(id: ID!): Nutrient!
    nutrient(criteria: NutrientInput, filter: [String]): Nutrient!
    nutrients(criteria: NutrientInput, options: QueryOptions): Nutrients!
    searchNutrients(criteria: Search!, options: QueryOptions): Nutrients!
  }

  extend type Mutation {
    addNutrient(nutrient: NutrientInput!): Nutrient!
    updateNutrient(id: ID!, nutrient: NutrientInput!): Nutrient!
    deleteNutrient(id: ID!): Nutrient!
  }
`
