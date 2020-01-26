import { gql } from 'apollo-server-express'

export default gql`
  type Recipe {
    id: ID!
    name: String!
    description: String
    image: String
    servings: Int
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
    postedBy: Account
    from: RecipeSource
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

  type RecipeIngredient {
    ingredient: Ingredient
    quantity: Float
    unit: MeasureUnit
  }

  type RecipeUtensil {
    utensil: Utensil
    quantity: Float
  }

  type RecipeSource {
    source: Source
    url: String
  }

  type RecipeStep {
    number: Int!
    instructions: String!
    image: String
  }

  input RecipeIngredientInput {
    ingredient: ID
    quantity: Float
    unit: ID
  }

  input RecipeUtensilInput {
    utensil: ID
    quantity: Float
  }

  input RecipeSourceInput {
    source: ID
    url: String
  }

  input RecipeStepInput {
    number: Int!
    instructions: String!
    image: String
  }

  input RecipeInput {
    name: String!
    description: String
    image: String
    servings: Int
    source: RecipeSourceInput
    readyInMinutes: Int
    steps: [RecipeStepInput!]
    categories: [ID!]
    ingredients: [RecipeIngredientInput!]
    utensils: [RecipeUtensilInput!]
    isPrivate: Boolean
    difficultyLevel: DifficultyLevel
    cost: Cost
    additionalImages: [String]
    nutrition: NutritionInput
    postedBy: ID
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
