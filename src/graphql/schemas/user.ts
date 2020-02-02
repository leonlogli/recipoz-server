import { gql } from 'apollo-server-express'

export default gql`
  """
  Firebase auth user
  """
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
    language: [String!]
    theme: String
    website: String
    aboutMe: String
    socials: [String!]
    disabled: Boolean!
    metadata: UserMetadata!
    providerData: [UserInfo!]
    roles: [UserRole!]
    tokensValidAfterTime: String
    tenantId: String
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

  """
  Firebase auth user input
  """
  input UserInput {
    email: String
    emailVerified: Boolean
    displayName: String
    phoneNumber: String
    photoURL: String
    coverImageUrl: String
    gender: String
    location: String
    language: [String!]
    theme: String
    website: String
    aboutMe: String
    socials: [String!]
    disabled: Boolean
  }

  input RegisterInput {
    email: String
    password: String
    phoneNumber: String
    displayName: String
    photoURL: String
    emailVerified: Boolean
  }

  """
  Firebase auth user query criteria
  """
  input UserCriteria {
    id: ID
    email: String
    phoneNumber: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    accessToken(authToken: String!): Token!
  }

  extend type Mutation {
    revokeRefreshTokens(accountId: ID!): Account!
    setUserRoles(accountId: ID!, roles: [UserRole!]!): Account!
  }
`
