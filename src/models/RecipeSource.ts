import mongoose, { Document, Schema } from 'mongoose'

/**
 * Recipe source ie where recipe is originally published
 */
export type RecipeSourceDocument = Document & {
  name: string
  website: string
  logo: string
  biography?: string
}

const recipeSourceSchema = new Schema({
  name: { type: String, unique: true },
  website: { type: String, unique: true },
  logo: String,
  biography: String
})

export const RecipeSource = mongoose.model<RecipeSourceDocument>(
  'RecipeSource',
  recipeSourceSchema
)
export default RecipeSource
