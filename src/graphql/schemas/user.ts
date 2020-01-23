import { gql } from 'apollo-server-express'

export default gql`
  type User {
    id: ID!
    email: String
    emailVerified: Boolean!
    displayName: String
    phoneNumber: String
    photoURL: String
    coverImageUrl: String
    gender: String
    location: String
    website: String
    aboutMe: String
    socials: [String]
    disabled: Boolean!
    metadata: UserMetadata!
    providerData: [UserInfo!]
    customClaims: CustomClaims
    tokensValidAfterTime: String
    tenantId: String
  }

  """
  The user's custom claims object if available, typically used to define
  user roles and propagated to an authenticated user's ID token.
  """
  type CustomClaims {
    roles: [UserRole!]
  }

  enum UserRole {
    ADMIN
    USER
  }

  """
  Additional metadata about the user.
  """
  type UserMetadata {
    lastSignInTime: String!
    creationTime: String!
  }

  """
  Interface representing a user's info from a third-party identity
  provider such as Google or Facebook.
  """
  type UserInfo {
    uid: String
    displayName: String
    email: String
    phoneNumber: String
    photoURL: String
    providerId: String
  }

  type Token {
    type: String
    accessToken: String!
    expiresIn: String
  }

  input UserInput {
    email: String
    password: String
    phoneNumber: String
    displayName: String
    photoURL: String
    emailVerified: boolean
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    user(id: ID!): User!
    getAccessToken(authToken: String!): Token!
  }

  extend type Mutation {
    register(user: UserInput!): User!
  }
`
