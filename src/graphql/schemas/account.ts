import { gql } from 'apollo-server-express'

export default gql`
  """
  Recipoz user account
  """
  type Account {
    id: ID!
    user: User!
    followers: [Account!]
    addedRecipes: [Recipe!]
    favoriteRecipes: [Recipe!]
    triedRrecipes: [Recipe!]
    settings: Settings
  }

  type DelectedAccount {
    id: ID!
    user: ID
    followers: [Account!]
    addedRecipes: [Recipe!]
    favoriteRecipes: [Recipe!]
    triedRrecipes: [Recipe!]
    settings: Settings
  }

  type NotificationSettings {
    type: NotificationType!
    codes: [NotificationCode!]!
  }

  """
  Recipoz user account settings
  """
  type Settings {
    notifications: NotificationSettings
    tastes: [Category!]
  }

  type Accounts {
    """
    Account list
    """
    content: [Account!]!
    page: Page
    totalElements: Int
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

  input SettingsCriteria {
    notifications: NotificationSettingsInput
    tastes: [ID!]
  }

  """
  Recipoz user account query criteria
  """
  input AccountCriteria {
    user: ID
    followers: [ID!]
    followings: [ID!]
    addedRecipes: [ID!]
    favoriteRecipes: [ID!]
    triedRrecipes: [ID!]
    settings: SettingsCriteria
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    myAccount: Account!
    accountById(id: ID!): Account!
    accountByUserInfo(criteria: UserCriteria!): Account!
    account(criteria: AccountCriteria, filter: [String]): Account!
    accounts(criteria: AccountCriteria, options: QueryOptions): Accounts!
  }

  extend type Mutation {
    """
    Add account for new user
    """
    createAccount(user: RegisterInput): Account!
    """
    Add account for firebase existing user
    """
    addAccount(userId: String!): Account!
    updateAccount(id: ID!, account: AccountInput!): Account!
    deleteAccount(id: ID!): DelectedAccount!
    followAccount(account: ID!): Account!
    unFollowAccount(account: ID!): Account!
    addFavoriteRecipe(recipe: ID!): Account!
    removeFavoriteRecipe(recipe: ID!): Account!
    addTriedRecipe(recipe: ID!): Account!
    removeTriedRecipe(recipe: ID!): Account!
    addTaste(category: ID!): Account!
    removeTaste(category: ID!): Account!
  }
`
