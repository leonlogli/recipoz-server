import gql from 'graphql-tag'

export const GET_UTENSIL_BY_ID = gql`
  query UtensilById($id: ID!) {
    utensilById(id: $id) {
      name
    }
  }
`

export const GET_UTENSIL = gql`
  query Utensil($criteria: UtensilInput, $filter: [String]) {
    utensil(criteria: $criteria, filter: $filter) {
      id
      name
    }
  }
`

export const GET_UTENSILS = gql`
  query utensils($criteria: UtensilInput, $options: QueryOptions) {
    utensils(criteria: $criteria, options: $options) {
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

export const SEARCH_UTENSILS = gql`
  query searchUtensils($criteria: Search!, $options: QueryOptions) {
    searchUtensils(criteria: $criteria, options: $options) {
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

export const ADD_UTENSIL = gql`
  mutation addUtensil($utensil: UtensilInput!) {
    addUtensil(utensil: $utensil) {
      id
      name
    }
  }
`

export const UPDATE_UTENSIL = gql`
  mutation updateUtensil($id: ID!, $utensil: UtensilInput!) {
    updateUtensil(id: $id, utensil: $utensil) {
      id
      name
    }
  }
`

export const DELETE_UTENSIL = gql`
  mutation deleteUtensil($id: ID!) {
    deleteUtensil(id: $id) {
      id
      name
    }
  }
`
