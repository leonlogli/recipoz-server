import gql from 'graphql-tag'

export const GET_SOURCE_BY_ID = gql`
  query sourceById($id: ID!) {
    sourceById(id: $id) {
      name
    }
  }
`

export const GET_SOURCE = gql`
  query source($criteria: SourceInput, $filter: [String]) {
    source(criteria: $criteria, filter: $filter) {
      id
      name
    }
  }
`

export const GET_SOURCES = gql`
  query sources($criteria: SourceInput, $options: QueryOptions) {
    sources(criteria: $criteria, options: $options) {
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

export const SEARCH_SOURCES = gql`
  query searchSources($criteria: Search!, $options: QueryOptions) {
    searchSources(criteria: $criteria, options: $options) {
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

export const ADD_SOURCE = gql`
  mutation addSource($source: SourceInput!) {
    addSource(source: $source) {
      id
      name
    }
  }
`

export const UPDATE_SOURCE = gql`
  mutation updateSource($id: ID!, $source: SourceInput!) {
    updateSource(id: $id, source: $source) {
      id
      name
    }
  }
`

export const DELETE_SOURCE = gql`
  mutation deleteSource($id: ID!) {
    deleteSource(id: $id) {
      id
      name
    }
  }
`
