import { gql } from 'apollo-server-express'

export default gql`
  type UserAccount {
    id: ID!
    user: ID!
    dailyRecipeViewCount: Int
    followers: [UserAccount!]
    followings: [UserAccount!]
    addedRecipes: [Recipe!]
    favoriteRecipes: [Recipe!]
    triedRrecipes: [Recipe!]
    preferences: Preference
    setting: Setting
  }

  type UserAccountResponse {
    id: ID!
    user: User!
    dailyRecipeViewCount: Int
    followers: [UserAccount!]
    followings: [UserAccount!]
    addedRecipes: [Recipe!]
    favoriteRecipes: [Recipe!]
    triedRrecipes: [Recipe!]
    preferences: Preference
    setting: Setting
  }

  type Preference {
    recipeCategories: [Category!]
  }

  type Setting {
    notificationTypes: NotificationType
    language: SupportedLanguage
    theme: string
  }

  input UserAccountInput {
    user: User
    dailyRecipeViewCount: Int
    followers: [UserAccount!]
    followings: [UserAccount!]
    addedRecipes: [Recipe!]
    favoriteRecipes: [Recipe!]
    triedRrecipes: [Recipe!]
    preferences: Preference
    setting: Setting
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    userAccount(id: ID!): UserAccountResponse!
    userAccounts: [UserAccountResponse!]!
  }

  extend type Mutation {
    addUserAccount(userAccount: UserAccountInput): UserAccountResponse!
    deleteUserAccount(id: ID!): ID!
    updateUserAccount(
      id: ID!
      userAccount: UserAccountInput
    ): UserAccountResponse!
  }
`
