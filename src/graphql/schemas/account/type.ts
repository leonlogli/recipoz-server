import { gql } from 'apollo-server-express'

export default gql`
  type Account implements Node {
    id: ID! @guid
    user: User!
    settings: AccountSettings
    createdAt: DateTime!
    updatedAt: DateTime
    followers(
      first: Int
      after: String
      last: Int
      before: String
    ): AccountConnection!
    following(
      filter: FollowingFilter
      first: Int
      after: String
      last: Int
      before: String
    ): FollowingConnection!
    personalRecipes(
      orderBy: RecipeOrderBy
      first: Int
      after: String
      last: Int
      before: String
    ): RecipeConnection!
    favoriteRecipes(
      first: Int
      after: String
      last: Int
      before: String
    ): RecipeConnection!
    savedRecipes(
      filter: SavedRecipeFilter
      first: Int
      after: String
      last: Int
      before: String
    ): RecipeConnection!
    madeRecipes(
      first: Int
      after: String
      last: Int
      before: String
    ): RecipeConnection!
    recipeCollections(
      first: Int
      after: String
      last: Int
      before: String
    ): RecipeCollectionConnection!
    shoppingList(
      filter: ShoppingListItemFilter
      first: Int
      after: String
      last: Int
      before: String
    ): ShoppingListItemConnection!
    abuseReports(
      first: Int
      after: String
      last: Int
      before: String
    ): AbuseReportConnection!
  }

  type AccountEdge {
    cursor: String!
    node: Account!
  }

  type AccountConnection {
    edges: [AccountEdge!]!
    nodes: [Account!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type AccountSettings {
    notifications: NotificationSettings
    allergies: [Allergy!]
    dislikedIngredients: [String!]
    cookingExperience: CookingExperience
    household: Household
  }

  type NotificationSettings {
    type: NotificationType!
    codes: [NotificationCode!]!
  }

  type Household {
    adults: Int
    children: Int
  }

  enum Allergy {
    DAIRY
    EGG
    GLUTEN
    PEANUT
    FISH
    SESAME
    SHELLFISH
    SOY
    TREE_NUT
    WHEAT
  }

  enum CookingExperience {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }
`
