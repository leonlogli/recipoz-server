import { gql } from 'apollo-server-express'

export default gql`
  type Account {
    id: ID! @id
    user: User!
    followers(page: PageInput, sort: String): Accounts!
    followings(page: PageInput, sort: String): Accounts!
    personalRecipes(page: PageInput, sort: String): Recipes!
    favoriteRecipes(page: PageInput, sort: String): Recipes!
    triedRrecipes(page: PageInput, sort: String): Recipes!
    settings: Settings
  }

  type NotificationSettings {
    type: NotificationType!
    codes: [NotificationCode!]!
  }

  type Settings {
    notifications: NotificationSettings
    tastes: [Category!]
  }

  type Accounts {
    content: [Account!]!
    totalCount: Int!
    page: Page
  }

  input NotificationSettingsInput {
    type: NotificationType!
    codes: [NotificationCode!]!
  }

  input SettingsInput {
    notifications: NotificationSettingsInput
  }

  input AccountInput {
    user: UserInput
    settings: SettingsInput
  }

  input SettingsQuery {
    notifications: NotificationSettingsInput
    tastes: [ID!]
  }

  input AccountQuery {
    followers: [ID!]
    favoriteRecipes: [ID!]
    triedRrecipes: [ID!]
    settings: SettingsQuery
  }

  type AccountMutationResponse implements MutationResponse {
    code: Int!
    success: Boolean!
    message: String!
    account: Account
  }

  type FollowAccountMutationResponse implements MutationResponse {
    code: Int!
    success: Boolean!
    message: String!
    me: Account!
    account: Account
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    me: Account! @auth
    account(id: ID!): Account!
    accountByEmail(email: String!): Account!
    accountByPhoneNumber(phoneNumber: String!): Account!
    accounts(
      query: AccountQuery
      page: PageInput
      options: QueryOptions
    ): Accounts!
  }

  extend type Mutation {
    "Add account for a new user"
    createAccount(user: RegisterInput): MutationResponse!
    "Add account for an firebase existing user"
    addAccount(user: ID!): MutationResponse!
    updateAccount(id: ID!, account: AccountInput!): MutationResponse! @auth
    deleteAccount(id: ID!): MutationResponse! @auth
    followAccount(account: ID!): MutationResponse! @auth
    unFollowAccount(account: ID!): MutationResponse! @auth
    addFavoriteRecipe(recipe: ID!): MutationResponse! @auth
    removeFavoriteRecipe(recipe: ID!): MutationResponse! @auth
    addTriedRecipe(recipe: ID!): MutationResponse! @auth
    removeTriedRecipe(recipe: ID!): MutationResponse! @auth
    addTaste(category: ID!): MutationResponse! @auth
    removeTaste(category: ID!): MutationResponse! @auth
  }
`
