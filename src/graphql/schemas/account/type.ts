import { gql } from 'apollo-server-express'

export default gql`
  type Account implements Node {
    id: ID! @guid
    user: User!
    notificationSettings: NotificationSettings
    allergies: [Allergy!]
    dislikedIngredients: [String!]
    cookingExperience: CookingExperience
    household: Household
    mealTimes: MealTimes
    createdAt: DateTime!
    updatedAt: DateTime
    followers(
      first: Int
      after: String
      last: Int
      before: String
    ): AccountConnection!
    following(
      followingTypes: [FollowingType!]
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
      collection: ID
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

  type NotificationSettings {
    type: NotificationType!
    codes: [NotificationCode!]!
  }

  type Household {
    adults: Int
    children: Int
  }

  type MealTimes {
    "User's breakfast time in hours"
    breakfastTime: Int
    "User's lunch time in hours"
    lunchTime: Int
    "User's dinner time in hours"
    dinnerTime: Int
    "Positive or negative offset from UTC in hours"
    timezoneOffset: Int
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
