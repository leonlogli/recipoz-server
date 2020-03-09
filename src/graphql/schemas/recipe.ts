import { gql } from 'apollo-server-express'

export default gql`
  type Recipe {
    id: ID!
    name: String!
    description: String
    image: String!
    servings: Int
    cookTime: Int
    prepTime: Int
    "Total time ie prepTime + cookTime"
    readyIn: Int!
    steps: [Step!]
    categories: [Category!]
    private: Boolean
    difficultyLevel: DifficultyLevel!
    cost: Cost!
    additionalImages: [String!]
    author: RecipeAuthor!
    sourceUrl: String
    ingredients: [Ingredient!]!
    tips: String
    nutrition: Nutrition
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

  type Ingredient {
    quantity: Float!
    unit: String!
    name: String!
  }

  type Step {
    number: Int!
    instruction: String!
    image: String
  }

  input IngredientInput {
    quantity: Float!
    unit: ID!
    name: String!
  }

  input StepInput {
    instruction: String!
    image: String
  }

  input IngredientCriteria {
    quantity: Float
    unit: ID
    name: String
  }

  input StepCriteria {
    instruction: String
    image: String
  }

  input RecipeInput {
    name: String!
    description: String
    image: String!
    servings: Int!
    "Recipe original source (Recipoz partners like food blog, website, etc.). Require user to be admin"
    source: ID
    "The url of the original recipe. Require when source is specified"
    sourceUrl: String
    "Cooking time in minutes. Optional if prepTime is specified"
    cookTime: Int
    "Prep time in minutes. Optional if cookTime is specified"
    prepTime: Int
    steps: [StepInput!]
    categories: [ID!]!
    "Recipe ingredients. Must contain at least 1 ingredient"
    ingredients: [IngredientInput!]!
    private: Boolean!
    difficultyLevel: DifficultyLevel!
    cost: Cost!
    additionalImages: [String!]
    tips: String
  }

  input RecipeCriteria {
    name: String
    description: String
    image: String
    servings: Int
    source: ID
    sourceUrl: String
    cookTime: Int
    prepTime: Int
    readyIn: Int
    steps: [StepInput!]
    categories: [ID!]
    ingredients: [IngredientCriteria!]
    private: Boolean!
    difficultyLevel: DifficultyLevel
    cost: Cost!
    additionalImages: [String!]
    tips: String
  }

  type Recipes {
    content: [Recipe!]!
    totalCount: Int!
    page: Page
  }

  type RecipeMutationResponse implements MutationResponse {
    code: Int!
    success: Boolean!
    message: String!
    recipe: Recipe
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    recipe(id: ID!): Recipe!
    recipes(criteria: RecipeCriteria!, options: QueryOptions): Recipes
    autocompleteRecipes(query: String!): [String!]!
    searchRecipes(query: String!, page: PageInput): Recipes
  }

  extend type Mutation {
    addRecipe(recipe: RecipeInput!): MutationResponse! @auth
    updateRecipe(id: ID!, recipe: RecipeInput!): MutationResponse! @auth
    deleteRecipe(id: ID!): MutationResponse! @auth
  }
`
