import { gql } from 'apollo-server-express'

export default gql`
  type MeasureUnit {
    id: ID!
    name: String!
    description: String
  }

  input MeasureUnitInput {
    name: String
    description: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    measureUnit(id: ID!): MeasureUnit!
    measureUnits: [MeasureUnit!]!
  }

  extend type Mutation {
    addMeasureUnit(measureUnit: MeasureUnitInput): MeasureUnit!
    updateMeasureUnit(id: ID!, measureUnit: MeasureUnitInput): MeasureUnit!
    deleteMeasureUnit(id: ID!): ID!
  }
`
