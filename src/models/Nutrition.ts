import { Schema, Document } from 'mongoose'

import { NutrientDocument } from './Nutrient'
import { MeasureUnitDocument } from './MeasureUnit'

const { ObjectId } = Schema.Types

export interface RecipeNutrientDocument extends Document {
  nutrient: NutrientDocument
  quantity: {
    amount: number
    unit: MeasureUnitDocument
  }
  dailyValue: {
    amount: number
    unit: MeasureUnitDocument
  }
  subNutrients?: RecipeNutrientDocument[]
}

export type NutritionDocument = Document & {
  totalCalory: number
  totalDailyValue: number
  nutrients: RecipeNutrientDocument[]
}

const recipeNutrientSchema = new Schema({
  nutrient: { type: ObjectId, ref: 'Nutrient' },
  quantity: {
    amount: { type: Number, required: 'Quantity is mandatory' },
    unit: { type: ObjectId, ref: 'MeasureUnit' }
  },
  dailyValue: {
    amount: { type: Number, required: 'Quantity is mandatory' },
    unit: { type: ObjectId, ref: 'MeasureUnit' }
  }
})

recipeNutrientSchema.add({ subNutrients: [recipeNutrientSchema] })

const nutritionSchema = new Schema({
  totalCalory: String,
  totalDailyValue: Number,
  nutrients: [recipeNutrientSchema]
})

export { nutritionSchema }
