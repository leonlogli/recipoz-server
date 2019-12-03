import mongoose from 'mongoose'

export type RecipeSourceDocument = mongoose.Document & {
  name: string
  url: string
}

const recipeSourceSchema = new mongoose.Schema({
  name: { type: String, required: 'Name is mandatory' },
  url: { type: String, required: 'Url is mandatory' }
})

export const RecipeSource = mongoose.model<RecipeSourceDocument>(
  'RecipeSource',
  recipeSourceSchema
)
