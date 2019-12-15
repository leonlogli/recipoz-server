import { gql } from 'apollo-server-express'

export default gql`
  type Nutrient {
    id: ID!
    name: String!
    code: String!
  }

  input NutrientInput {
    name: String
    code: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    nutrient(id: ID!): Nutrient!
    nutrients: [Nutrient!]!
  }

  extend type Mutation {
    addNutrient(nutrient: NutrientInput): Nutrient!
    updateNutrient(id: ID!, nutrient: NutrientInput): Nutrient!
    deleteNutrient(id: ID!): ID!
  }
`
