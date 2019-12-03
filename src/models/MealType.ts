import mongoose from 'mongoose'

/**
 * The type of meal a recipe belongs to.
 * Ex : 'Breakfast', 'Lunch', 'Dinner', 'Snack'
 */
export type MealTypeDocument = mongoose.Document & {
  name: string
}

const mealTypeSchema = new mongoose.Schema({
  name: { type: String, required: 'Name is mandatory' }
})

export const MealType = mongoose.model<MealTypeDocument>(
  'MealType',
  mealTypeSchema
)
