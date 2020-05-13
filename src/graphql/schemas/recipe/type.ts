import { gql } from 'apollo-server-express'

export default gql`
  type Recipe implements Node {
    id: ID! @guid
    name: String!
    description: String
    image: String!
    servings: Int!
    cookTime: Int
    prepTime: Int
    readyIn: Int!
    instructions: [Instruction!]
    categories: [Category!]
    private: Boolean
    difficultyLevel: DifficultyLevel!
    cost: Cost!
    additionalImages: [String!]
    author: Account!
    source: RecipeSource
    sourceLink: String
    ingredients: [Ingredient!]!
    tips: String
    createdAt: DateTime!
    updatedAt: DateTime
    "Check if the current user saved this recipe as favorite."
    isFavorite: Boolean!
    "Check if the current user made this recipe"
    isMade: Boolean!
    rating: RatingSummary
    "Recipe reviews"
    comments(
      orderBy: RecipeOrderBy
      first: Int
      after: String
      last: Int
      before: String
    ): CommentConnection!
    favoriteBy(
      first: Int
      after: String
      last: Int
      before: String
    ): AccountConnection!
    madeBy(
      first: Int
      after: String
      last: Int
      before: String
    ): AccountConnection!
  }

  type RecipeEdge {
    cursor: String!
    node: Recipe!
  }

  type RecipeConnection {
    edges: [RecipeEdge!]!
    nodes: [Recipe!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  enum Cost {
    CHEAP
    EXPENSIVE
    VERY_EXPENSIVE
  }

  enum DifficultyLevel {
    TOO_EASY
    EASY
    DIFFICULT
    VERY_DIFFICULT
  }

  enum RecipeOrderBy {
    DATE_ASC
    DATE_DESC
  }

  type Instruction {
    step: Int!
    text: String!
    image: String
  }

  type Ingredient {
    quantity: String
    name: String!
    group: String
  }
`
