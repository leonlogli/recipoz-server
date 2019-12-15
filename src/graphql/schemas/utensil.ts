import { gql } from 'apollo-server-express'

export default gql`
  type Utensil {
    id: ID!
    name: String!
    description: String
    image: String
  }

  input UtensilInput {
    name: String
    description: String
    image: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    utensil(id: ID!): Utensil!
    utensils: [Utensil!]!
  }

  extend type Mutation {
    addUtensil(utensil: UtensilInput): Utensil!
    updateUtensil(id: ID!, utensil: UtensilInput): Utensil!
    deleteUtensil(id: ID!): ID!
  }
`
