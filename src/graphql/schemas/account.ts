import { gql } from 'apollo-server-express'

export default gql`
  """
  Recipoz user account
  """
  type Account {
    id: ID!
    user: User!
    followers: [Account!]
    followings: [Account!]
    addedRecipes: [Recipe!]
    favoriteRecipes: [Recipe!]
    triedRrecipes: [Recipe!]
    settings: Settings
  }

  type NotificationSettings {
    category: NotificationType!
    types: [NotificationCode!]!
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
    category: NotificationType!
    types: [NotificationCode!]!
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
    user: UserCriteria
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
    accountById(id: ID!): Account!
    account(criteria: AccountCriteria, filter: [String]): Account!
    accounts(criteria: AccountCriteria, options: QueryOptions): Accounts!
    searchAccounts(criteria: Search!, options: QueryOptions): Accounts!
  }

  extend type Mutation {
    addAccount(id: ID!): Account!
    updateAccount(id: ID!, account: AccountInput!): Account!
    deleteAccount(id: ID!): Account!
    followAccount(id: ID!, account: ID!): Account!
    unFollowAccount(id: ID!, account: ID!): Account!
    addFavoriteRecipe(id: ID!, recipe: ID!): Account!
    removeFavoriteRecipe(id: ID!, recipe: ID!): Account!
    addTriedRecipe(id: ID!, recipe: ID!): Account!
    removeTriedRecipe(id: ID!, recipe: ID!): Account!
    addTaste(id: ID!, category: ID!): Account!
    removeTaste(id: ID!, category: ID!): Account!
  }
`
