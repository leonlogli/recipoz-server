import mongoose, { Document, Schema } from 'mongoose'

import { UserDocument, NotificationCode } from '.'
import { notificationCodes as codes } from './Notification'

type Household = {
  adults: number
  children: number
}

type MealTimes = {
  /** User's breakfast time in hours */
  breakfastTime: number
  /** User's lunch time in hours */
  lunchTime: number
  /** User's dinner time in hours */
  dinnerTime: number
  /** Positive or negative offset from UTC in hours */
  timezoneOffset: number
}

type NotificationSettings = {
  email: NotificationCode[]
  push: NotificationCode[]
}

export type AccountDocument = Document & {
  user: UserDocument
  registrationTokens: string[]
  // settings
  notificationSettings: NotificationSettings
  allergies: Allergy[]
  dislikedIngredients: string[]
  cookingExperience?: CookingExperience
  household: Household
  mealTimes: MealTimes
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
    notificationSettings: {
      email: { type: [String], enum: codes },
      push: { type: [String], enum: codes, default: codes }
    },
    allergies: { type: [String], enum: allergies },
    dislikedIngredients: [String],
    cookingExperience: { type: String, enum: cookingExperiences },
    household: {
      adults: { type: Number, default: 1 },
      children: Number
    },
    mealTimes: {
      breakfastTime: { type: Number, default: 8 },
      lunchTime: { type: Number, default: 12 },
      dinnerTime: { type: Number, default: 18 },
      timezoneOffset: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
)

export const Account = mongoose.model<AccountDocument>('Account', accountSchema)
export default Account
