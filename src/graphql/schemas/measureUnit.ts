import { gql } from 'apollo-server-express'

export default gql`
  type MeasureUnit {
    id: ID!
    name: String!
    description: String
  }

  type Categories {
    """
    MeasureUnit list
    """
    content: [MeasureUnit!]!
    page: Page
    totalElements: Int
  }

  input MeasureUnitInput {
    name: String
    description: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    measureUnitById(id: ID!): MeasureUnit!
    measureUnit(criteria: MeasureUnitInput, filter: [String]): MeasureUnit!
    measureUnits(
      criteria: MeasureUnitInput
      options: QueryOptions
    ): MeasureUnit!
    searchMeasureUnits(criteria: Search!, options: QueryOptions): MeasureUnit!
  }

  extend type Mutation {
    addMeasureUnit(measureUnit: MeasureUnitInput!): MeasureUnit!
    updateMeasureUnit(id: ID!, measureUnit: MeasureUnitInput!): MeasureUnit!
    deleteMeasureUnit(id: ID!): MeasureUnit!
  }
`
