import { gql } from 'apollo-server-express'

export default gql`
  #################################################
  #              MUTATION PAYLOADS
  #################################################

  type RegisterPayload {
    code: String!
    success: Boolean!
    message: String!
    account: Account
    clientMutationId: String
  }

  type AddAccountPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    account: Account
    accessToken: Token
  }

  type UpdateAccountPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    account: Account
  }

  type DeleteAccountPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    account: Account
  }

  type AddRegistrationTokenPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    account: Account
  }

  #################################################
  #                 MUTATIONS
  #################################################

  extend type Mutation {
    "Add account for a new user"
    register(input: RegisterInput!): RegisterPayload!
    "Add account for an firebase existing user"
    addAccount(input: AddAccountInput!): AddAccountPayload!
    updateAccount(input: UpdateAccountInput!): UpdateAccountPayload! @auth
    deleteAccount(input: DeleteAccountInput!): DeleteAccountPayload! @auth
    addRegistrationToken(
      input: AddRegistrationTokenInput!
    ): AddRegistrationTokenPayload! @auth
  }
`
