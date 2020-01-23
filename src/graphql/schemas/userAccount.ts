import { gql } from 'apollo-server-express'

export default gql`
  type UserAccount {
    id: ID!
    user: User!
    followers: [UserAccount!]
    followings: [UserAccount!]
    addedRecipes: [Recipe!]
    favoriteRecipes: [Recipe!]
    triedRrecipes: [Recipe!]
    settings: Settings
  }

  type Preferences {
    recipeCategories: [Category!]
  }

  type Settings {
    notificationTypes: NotificationType
    language: SupportedLanguage
    theme: String
    preferences: Preferences
  }

  input UserAccountInput {
    user: ID!
    settings: Settings
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    userAccount(id: ID!): UserAccountResponse!
    userAccounts: [UserAccountResponse!]!
  }

  extend type Mutation {
    createUserAccount(userAccount: UserAccountInput): UserAccount!
    deleteUserAccount(id: ID!): ID!
    updateUserAccount(
      id: ID!
      userAccount: UserAccountInput
    ): UserAccountResponse!
  }
`
