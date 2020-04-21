import mongoose, { Document, Schema } from 'mongoose'

import { AccountDocument } from './Account'
import { RecipeDocument } from './Recipe'
import { RecipeCollectionDocument } from './RecipeCollection'

/**
 * Account saved recipe
 */
export type SavedRecipeDocument = Document & {
  collectionType: RecipeCollectionType
  recipeCollection: RecipeCollectionDocument
  account: AccountDocument
  recipe: RecipeDocument
}

const { ObjectId } = Schema.Types

export const recipeCollectionTypes = ['FAVORITE', 'MADE'] as const

export type RecipeCollectionType = typeof recipeCollectionTypes[number]

const savedRecipeSchema = new Schema({
  collectionType: { type: String, enum: recipeCollectionTypes },
  recipeCollection: { type: ObjectId, ref: 'RecipeCollection' },
  account: { type: ObjectId, ref: 'Account' },
  recipe: { type: ObjectId, ref: 'Recipe' }
})

// Frequent access indexes
savedRecipeSchema.index({ account: 1 })
savedRecipeSchema.index({ recipe: 1 })

/**
 * Account saved recipe model
 */
export const SavedRecipe = mongoose.model<SavedRecipeDocument>(
  'SavedRecipe',
  savedRecipeSchema
)
export default SavedRecipe
