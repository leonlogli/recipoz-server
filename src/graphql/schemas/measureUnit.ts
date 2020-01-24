import { gql } from 'apollo-server-express'

export default gql`
  type MeasureUnit {
    id: ID!
    name: String!
    description: String
  }

  type MeasureUnits {
    """
    MeasureUnit list
    """
    content: [MeasureUnit!]!
    page: Page
    totalElements: Int
  }

  input MeasureUnitInput {
    name: I18n
    description: I18n
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
    ): MeasureUnits!
    searchMeasureUnits(criteria: Search!, options: QueryOptions): MeasureUnits!
  }

  extend type Mutation {
    addMeasureUnit(measureUnit: MeasureUnitInput!): MeasureUnit!
    updateMeasureUnit(id: ID!, measureUnit: MeasureUnitInput!): MeasureUnit!
    deleteMeasureUnit(id: ID!): MeasureUnit!
  }
`
