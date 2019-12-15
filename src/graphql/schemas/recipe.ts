import { gql } from 'apollo-server-express'

export default gql`
  type Recipe {
    id: ID!
    name: String!
    description: String
    image: String
    servings: Int
    source: Source
    readyInMinutes: Int
    steps: [RecipeStep!]
    categories: [Category!]
    ingredients: [RecipeIngredient!]
    utensils: [RecipeUtensil!]
    isPrivate: Boolean
    difficultyLevel: DifficultyLevel
    cost: Cost
    additionalImages: [String]
    nutrition: Nutrition
    poster: UserAccount
  }

  type RecipeIngredient {
    ingredient: Ingredient
    quantity: number
    unit: MeasureUnit
  }

  type RecipeUtensil {
    utensil: Utensil
    quantity: number
  }

  enum Cost {
    CHEAP
    EXPENSIVE
    VERY_EXPENSIVE
  }

  type RecipeStep {
    number: Int!
    instructions: String!
    image: String
  }

  enum DifficultyLevel {
    TOO_EASY
    EASY
    DIFFICULT
    VERY_DIFFICULT
  }

  type Source {
    websiteSource: RecipeSource!
    recipeUrl: String!
  }

  type Nutrition {
    totalCalory: Float
    totalDailyValue: Float
    nutrients: [RecipeNutrient!]
  }

  type RecipeNutrientQuantity {
    amount: Float!
    unit: MeasureUnit!
  }

  type RecipeNutrient {
    nutrient: Nutrient!
    quantity: RecipeNutrientQuantity!
    dailyValue: RecipeNutrientQuantity!
    subNutrients: [RecipeNutrient!]
  }

  input RecipeInput {
    name: String!
    description: String
    image: String
    servings: Int
    source: Source
    readyInMinutes: Int
    steps: [RecipeStep!]
    categories: [ID!]
    ingredients: [RecipeIngredient!]
    utensils: [RecipeUtensil!]
    isPrivate: Boolean
    difficultyLevel: DifficultyLevel
    cost: Cost
    additionalImages: [String]
    nutrition: Nutrition
    poster: ID
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    recipe(id: ID!): Recipe!
    recipes: [Recipe!]!
  }

  extend type Mutation {
    addRecipe(recipe: RecipeInput): Recipe!
    updateRecipe(id: ID!, recipe: RecipeInput): Recipe!
    deleteRecipe(id: ID!): ID!
  }
`
