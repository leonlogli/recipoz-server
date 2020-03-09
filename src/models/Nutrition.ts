import { Schema, Document } from 'mongoose'

export type NutritionDocument = Document & {
  calories: number
  fat: number
  saturatedFat?: number
  transFat?: number
  cholesterol: number
  sodium: number
  carbs: number
  dietaryFiber?: number
  sugars?: number
  protein: number
  potassium?: number
  vitA?: number
  vitC?: number
  calcium?: number
  iron?: number
}

const nutritionSchema = new Schema({
  calories: Number,
  fat: Number,
  saturatedFat: Number,
  transFat: Number,
  cholesterol: Number,
  sodium: Number,
  carbs: Number,
  dietaryFiber: Number,
  sugars: Number,
  protein: Number,
  potassium: Number,
  vitA: Number,
  vitC: Number,
  calcium: Number,
  iron: Number
})

export { nutritionSchema }
