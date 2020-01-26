import mongoose, { Document, Schema } from 'mongoose'

import {
  CategoryDocument,
  RecipeDocument,
  UserDocument,
  NotificationCode
} from '.'
import {
  notificationCodes,
  notificationTypes,
  NotificationType
} from './Notification'

const { ObjectId } = Schema.Types

export type AccountDocument = Document & {
  user: UserDocument
  followers?: AccountDocument[]
  followings?: AccountDocument[]
  addedRecipes?: RecipeDocument[]
  favoriteRecipes?: RecipeDocument[]
  triedRrecipes?: RecipeDocument[]
  settings: {
    notifications?: {
      category: NotificationType
      types: NotificationCode[]
    }
    tastes?: CategoryDocument[]
  }
}

const accountSchema = new Schema(
  {
    user: String,
    dailyRecipeViewCount: Number,
    followers: [{ type: ObjectId, ref: 'UserAccount' }],
    followings: [{ type: ObjectId, ref: 'UserAccount' }],
    addedRecipes: [{ type: ObjectId, ref: 'Recipe' }],
    favoriteRecipes: [{ type: ObjectId, ref: 'Recipe' }],
    triedRrecipes: [{ type: ObjectId, ref: 'Recipe' }],
    notificationTypes: { type: [String], enum: notificationCodes },
    settings: {
      notifications: {
        category: { type: String, enum: notificationTypes },
        code: { type: [String], enum: notificationCodes }
      },
      tastes: [{ type: ObjectId, ref: 'Category' }]
    }
  },
  { timestamps: true }
)

export const Account = mongoose.model<AccountDocument>('Account', accountSchema)
