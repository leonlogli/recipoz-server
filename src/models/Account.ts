import mongoose, { Document, Schema } from 'mongoose'

import { UserDocument, NotificationCode } from '.'
import {
  notificationCodes,
  notificationTypes,
  NotificationType
} from './Notification'

export type NotificationSetting = {
  type: NotificationType
  codes: NotificationCode[]
}

type Household = {
  adults: number
  children: number
}

export type AccountDocument = Document & {
  user: UserDocument
  registrationTokens: string[]
  settings?: {
    notifications?: NotificationSetting[]
    allergies: Allergy[]
    dislikedIngredients: string[]
    cookingExperience: CookingExperience
    household: Household
  }
}

export const allergies = [
  'DAIRY',
  'EGG',
  'GLUTEN',
  'PEANUT',
  'FISH',
  'SESAME',
  'SHELLFISH',
  'SOY',
  'TREE_NUT',
  'WHEAT'
] as const

export type Allergy = typeof allergies[number]

export const cookingExperiences = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED'
] as const

export type CookingExperience = typeof cookingExperiences[number]

const accountSchema = new Schema(
  {
    user: { type: String, unique: true },
    registrationTokens: [String], // FCM SDK registration tokens par user
    settings: {
      notifications: {
        type: { type: String, enum: notificationTypes },
        codes: { type: [String], enum: notificationCodes }
      },
      allergies: { type: [String], enum: allergies },
      dislikedIngredients: [String], // at most 1000/account
      cookingExperience: { type: String, enum: cookingExperiences },
      household: {
        adults: { type: Number, default: 1 },
        children: Number
      }
    }
  },
  { timestamps: true }
)

export const Account = mongoose.model<AccountDocument>('Account', accountSchema)
export default Account
