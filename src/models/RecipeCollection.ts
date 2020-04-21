import mongoose, { Document, Schema } from 'mongoose'
import { AccountDocument } from './Account'

/**
 * User custom recipe collection
 */
export type RecipeCollectionDocument = Document & {
  account: AccountDocument
  name: string
  description?: string
  private: boolean
}

const { ObjectId } = Schema.Types

const recipeCollectionSchema = new Schema({
  account: { type: ObjectId, ref: 'Account' },
  name: String,
  description: String,
  private: { type: Boolean, default: false }
})

recipeCollectionSchema.index({ account: 1, name: 1 }, { unique: true })

/**
 * User custom recipe collection model
 */
export const RecipeCollection = mongoose.model<RecipeCollectionDocument>(
  'RecipeCollection',
  recipeCollectionSchema
)
export default RecipeCollection
