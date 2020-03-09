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
    gender: Gender
    location: String
    language: String
    theme: String
    website: String
    aboutMe: String
    birthday: String
    facebook: String
    pinterest: String
    twitter: String
    disabled: Boolean!
    metadata: UserMetadata!
    providerData: [UserInfo!]
    roles: [Role!]!
    tokensValidAfterTime: String
    tenantId: String
  }

  enum Role {
    ADMIN
    USER
  }

  enum Gender {
    M
    F
  }

  "Additional metadata about the user"
  type UserMetadata {
    lastSignInTime: String!
    creationTime: String!
  }

  "Interface representing a user's info from a third-party identity provider such as Google or Facebook"
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

  "Firebase auth user input"
  input UserInput {
    email: String
    password: String
    emailVerified: Boolean
    displayName: String
    phoneNumber: String
    photoURL: String
    coverImageUrl: String
    gender: Gender
    location: String
    language: String
    theme: String
    website: String
    aboutMe: String
    birthday: String
    facebook: String
    pinterest: String
    twitter: String
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

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    accessToken(authToken: String!): Token!
  }

  extend type Mutation {
    revokeRefreshTokens(account: ID!): MutationResponse! @auth(requires: ADMIN)
    setRoles(account: ID!, roles: [Role!]!): MutationResponse!
      @auth(requires: ADMIN)
  }
`
