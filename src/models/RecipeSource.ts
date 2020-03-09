import mongoose, { Document, Schema } from 'mongoose'
import { AccountDocument } from './Account'

const { ObjectId } = Schema.Types

/**
 * Recipe source ie where recipe is originally published
 */
export type RecipeSourceDocument = Document & {
  name: string
  website: string
  logo: string
  coverImage?: string
  about?: string
  followers: AccountDocument
}

const recipeSourceSchema = new Schema({
  name: { type: String, unique: true },
  website: { type: String, unique: true },
  logo: String,
  coverImage: String,
  about: String,
  followers: [{ type: ObjectId, ref: 'Account' }]
})

export const RecipeSource = mongoose.model<RecipeSourceDocument>(
  'RecipeSource',
  recipeSourceSchema
)
export default RecipeSource
