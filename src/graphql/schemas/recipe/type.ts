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
    author: RecipeAuthor!
    originalLink: String
    ingredients: [Ingredient!]!
    tips: String
    createdAt: String!
    updatedAt: String
    "Check if the current user saved this recipe as favorite."
    isFavorite: Boolean @auth
    "Check if the current user made this recipe"
    isMade: Boolean @auth
    rating: RatingSummary
    "Recipe reviews"
    comments(
      CommentOrderBy: RecipeOrderBy
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

  union RecipeAuthor = Account | RecipeSource

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
