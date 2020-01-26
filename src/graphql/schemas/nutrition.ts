import { gql } from 'apollo-server-express'

export default gql`
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

  input RecipeNutrientInput {
    nutrient: ID!
    quantity: RecipeNutrientQuantityInput!
    dailyValue: RecipeNutrientQuantityInput!
    subNutrients: [RecipeNutrientInput!]
  }

  input RecipeNutrientQuantityInput {
    amount: Float!
    unit: ID!
  }

  input NutritionInput {
    totalCalory: Float
    totalDailyValue: Float
    nutrients: [RecipeNutrientInput!]
  }
`
