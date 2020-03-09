import gql from 'graphql-tag'

export const GET_MEASUREUNIT_BY_ID = gql`
  query measureUnitById($id: ID!) {
    measureUnitById(id: $id) {
      name
    }
  }
`

export const GET_MEASUREUNIT = gql`
  query measureUnit($criteria: MeasureUnitInput, $filter: [String]) {
    measureUnit(criteria: $criteria, filter: $filter) {
      id
      name
    }
  }
`

export const GET_MEASUREUNITS = gql`
  query measureUnits($criteria: MeasureUnitInput, $options: QueryOptions) {
    measureUnits(criteria: $criteria, options: $options) {
      content {
        name
      }
      page {
        number
        count
        size
      }
      totalElements
    }
  }
`

export const SEARCH_MEASUREUNITS = gql`
  query searchMeasureUnits($criteria: Search!, $options: QueryOptions) {
    searchMeasureUnits(criteria: $criteria, options: $options) {
      content {
        name
      }
      page {
        number
        count
        size
      }
      totalElements
    }
  }
`

export const ADD_MEASUREUNIT = gql`
  mutation addMeasureUnit($measureUnit: MeasureUnitInput!) {
    addMeasureUnit(measureUnit: $measureUnit) {
      id
      name
    }
  }
`

export const UPDATE_MEASUREUNIT = gql`
  mutation updateMeasureUnit($id: ID!, $measureUnit: MeasureUnitInput!) {
    updateMeasureUnit(id: $id, measureUnit: $measureUnit) {
      id
      name
    }
  }
`

export const DELETE_MEASUREUNIT = gql`
  mutation deleteMeasureUnit($id: ID!) {
    deleteMeasureUnit(id: $id) {
      id
      name
    }
  }
`
