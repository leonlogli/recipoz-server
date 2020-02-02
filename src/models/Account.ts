import mongoose, { Document, Schema } from 'mongoose'
import { UserInputError as Error } from 'apollo-server-express'

import { errorMessages } from '../constants'
import { i18n } from '../utils'

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
  addedRecipes?: RecipeDocument[]
  favoriteRecipes?: RecipeDocument[]
  triedRrecipes?: RecipeDocument[]
  settings: {
    notifications?: {
      type: NotificationType
      codes: NotificationCode[]
    }
    tastes?: CategoryDocument[]
  }
}

const accountSchema = new Schema(
  {
    user: { type: String, unique: true },
    followers: [{ type: ObjectId, ref: 'Account' }],
    addedRecipes: [{ type: ObjectId, ref: 'Recipe' }],
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

accountSchema.pre('validate', function validate(next) {
  const { user } = this as any

  if (!user || !user.trim()) {
    return next(new Error(i18n.t(errorMessages.account.userIdIsMandatory)))
  }

  return next()
})

export const Account = mongoose.model<AccountDocument>('Account', accountSchema)
