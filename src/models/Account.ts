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
  favoriteRecipes?: RecipeDocument[]
  triedRrecipes?: RecipeDocument[]
  settings?: {
    notifications?: NotificationSetting[]
    tastes?: CategoryDocument[]
  }
}

export type NotificationSetting = {
  type: NotificationType
  codes: NotificationCode[]
}

const accountSchema = new Schema(
  {
    user: { type: String, unique: true },
    followers: [{ type: ObjectId, ref: 'Account' }],
    favoriteRecipes: [{ type: ObjectId, ref: 'Recipe' }],
    triedRrecipes: [{ type: ObjectId, ref: 'Recipe' }],
    settings: {
      notifications: {
        type: { type: String, enum: notificationTypes },
        codes: { type: [String], enum: notificationCodes }
      },
      tastes: [{ type: ObjectId, ref: 'Category' }]
    }
  },
  { timestamps: true }
)

export const Account = mongoose.model<AccountDocument>('Account', accountSchema)
export default Account
