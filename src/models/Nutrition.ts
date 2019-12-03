import mongoose from 'mongoose'
import { RecipeNutrientDocument, recipeNutrientSchema } from './RecipeNutrient'

export type NutritionDocument = mongoose.Document & {
  totalCalory: number
  totalDailyValue: number
  nutrients: RecipeNutrientDocument[]
}

const nutritionSchema = new mongoose.Schema({
  totalCalory: String,
  totalDailyValue: Number,
  nutrients: [recipeNutrientSchema]
})

export { nutritionSchema }
