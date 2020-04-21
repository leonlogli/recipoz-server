import mongoose, { Document, Schema } from 'mongoose'

import { AccountDocument, RecipeDocument } from '.'

export type ShoppingListItemDocument = Document & {
  account: AccountDocument
  recipe: RecipeDocument
  name: string
  category: ShoppingListItemCategory
  quantity: string
  checked: boolean
}

const { ObjectId } = Schema.Types

export const shoppingListItemCategories = [
  'HERBS_AND_SPICES',
  'BAKING',
  'CANNED_FOODS',
  'CONDIMENTS',
  'DAIRY',
  'MEATS_AND_SEAFOOD',
  'FROZEN_FOODS',
  'DRINKS',
  'FRUITS_AND_VEGETABLES',
  'BREAD_AND_BAKERY',
  'HOUSEHOLD',
  'BREAKFAST_FOODS',
  'PASTA_RICE_AND_BEANS',
  'SNACK_FOODS',
  'HEALTH_AND_BEAUTY',
  'BABY_CARE',
  'PET_CARE',
  'OTHER'
] as const

export type ShoppingListItemCategory = typeof shoppingListItemCategories[number]

const shoppingListItemSchema = new Schema({
  account: { type: ObjectId, ref: 'Account' },
  recipe: { type: ObjectId, ref: 'Recipe' },
  name: String,
  quantity: String,
  category: { type: String, enum: shoppingListItemCategories },
  checked: { type: Boolean, default: false }
})

// For the frequent access
shoppingListItemSchema.index({ account: 1 })

export const ShoppingListItem = mongoose.model<ShoppingListItemDocument>(
  'ShoppingListItem',
  shoppingListItemSchema
)
export default ShoppingListItem
