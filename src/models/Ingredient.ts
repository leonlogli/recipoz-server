import mongoose from 'mongoose'

export type IngredientDocument = mongoose.Document & {
  name: string
  description?: string
  image: string
}

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: 'Name is mandatory' },
  description: String,
  image: { type: String, required: 'Image is mandatory' }
})

export const Ingredient = mongoose.model<IngredientDocument>(
  'Ingredient',
  ingredientSchema
)
