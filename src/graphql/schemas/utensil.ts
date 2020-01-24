import { gql } from 'apollo-server-express'

export default gql`
  type Utensil {
    id: ID!
    name: String!
    description: String
    image: String
  }

  type Utensils {
    """
    Utensil list
    """
    content: [Utensil!]!
    page: Page
    totalElements: Int
  }

  input UtensilInput {
    name: I18n
    description: I18n
    image: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    utensilById(id: ID!): Utensil!
    utensil(criteria: UtensilInput, filter: [String]): Utensil!
    utensils(criteria: UtensilInput, options: QueryOptions): Utensils!
    searchUtensils(criteria: Search!, options: QueryOptions): Utensils!
  }

  extend type Mutation {
    addUtensil(utensil: UtensilInput!): Utensil!
    updateUtensil(id: ID!, utensil: UtensilInput!): Utensil!
    deleteUtensil(id: ID!): Utensil!
  }
`
