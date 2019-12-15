import mongoose, { Document, Schema } from 'mongoose'

import {
  CategoryDocument,
  RecipeDocument,
  UserDocument,
  NotificationType
} from '.'
import { notificationTypes } from './Notification'

const { ObjectId } = Schema.Types

export type UserAccountDocument = Document & {
  user: UserDocument
  dailyRecipeViewCount?: number
  followers?: UserAccountDocument[]
  followings?: UserAccountDocument[]
  addedRecipes?: RecipeDocument[]
  favoriteRecipes?: RecipeDocument[]
  triedRrecipes?: RecipeDocument[]
  preferences: {
    recipeCategories?: CategoryDocument[]
  }
  setting: {
    notificationTypes?: NotificationType[]
    language?: string
    theme?: string
  }
}

const userAccountSchema = new Schema(
  {
    user: String,
    dailyRecipeViewCount: Number,
    followers: [{ type: ObjectId, ref: 'UserAccount' }],
    followings: [{ type: ObjectId, ref: 'UserAccount' }],
    addedRecipes: [{ type: ObjectId, ref: 'Recipe' }],
    favoriteRecipes: [{ type: ObjectId, ref: 'Recipe' }],
    triedRrecipes: [{ type: ObjectId, ref: 'Recipe' }],
    preferences: {
      recipeCategories: [{ type: ObjectId, ref: 'Category' }]
    },
    setting: {
      notificationTypes: { type: [String], enum: notificationTypes },
      language: String,
      theme: String
    }
  },
  { timestamps: true }
)

export const UserAccount = mongoose.model<UserAccountDocument>(
  'UserAccount',
  userAccountSchema
)
