import { gql } from 'apollo-server-express'

export default gql`
  """
  Firebase auth user
  """
  type User {
    email: String
    emailVerified: Boolean!
    displayName: String
    phoneNumber: String
    photoURL: String
    coverImageUrl: String
    """
    We don't need to use Account graphql here since User does not extends Node interface.
    Instead, we refer to account GUID only to ease firebase auth on the client side
    """
    accountGUID: String!
    gender: Gender
    location: String
    language: String
    theme: String
    website: String
    biography: String
    birthday: String
    facebook: String
    pinterest: String
    twitter: String
    instagram: String
    disabled: Boolean!
    metadata: UserMetadata!
    providerData: [UserInfo!]
    roles: [Role!]!
    tokensValidAfterTime: String
    tenantId: String
  }

  "User roles"
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

  type RevokeRefreshTokensPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    account: Account
  }

  type SetUserRolesPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    account: Account
  }

  "Firebase auth user input"
  input UserInput {
    email: EmailAddress
    password: String
    emailVerified: Boolean
    displayName: String
    phoneNumber: String
    photoURL: URL
    coverImageUrl: URL
    gender: Gender
    location: String
    language: String
    theme: String
    website: URL
    biography: String
    birthday: DateTime
    facebook: URL
    pinterest: URL
    twitter: URL
    instagram: URL
    disabled: Boolean
  }

  input SetUserRolesInput {
    "account id"
    account: ID!
    roles: [Role!]!
    clientMutationId: String
  }

  input RevokeRefreshTokensInput {
    "account id"
    account: ID!
    clientMutationId: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    accessToken("Firebase user idToken" idToken: String!): Token!
  }

  extend type Mutation {
    revokeRefreshTokens(
      input: RevokeRefreshTokensInput!
    ): RevokeRefreshTokensPayload! @auth(requires: ADMIN)
    setUserRoles(input: SetUserRolesInput): SetUserRolesPayload!
      @auth(requires: ADMIN)
  }
`
