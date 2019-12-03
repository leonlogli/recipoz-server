import mongoose, { Schema, Document } from 'mongoose'
import { UserDocument } from './User'
import { RecipeDocument } from './Recipe'
import { CategoryDocument } from './Category'
import { CuisineDocument } from './Cuisine'
import { NotificationDocument } from './Notification'

const { ObjectId } = Schema.Types

export type RecipozUserDocument = Document & {
  account: UserDocument
  dailyViewedRecipesCount?: number
  followers?: RecipozUserDocument[]
  followings?: RecipozUserDocument[]
  addedRecipes?: RecipeDocument[]
  favoriteRecipes?: RecipeDocument[]
  triedRrecipes?: RecipeDocument[]
  notifications?: NotificationDocument[]
  preferences?: {
    recipeCategories?: CategoryDocument
    cuisines?: CuisineDocument[]
    recentlyViewedRecipes?: RecipeDocument[]
  }
  // transcient fields
  totalFollowers: number
  totalAddedRecipes: number
  totalFavoriteRecipes: number
  totalTriedRrecipes: number
  totalFollowings: number
  totalNotifications: number
}

const recipozUserSchema = new Schema({
  account: String,
  dailyViewedRecipesCount: Number,
  followers: [{ type: ObjectId, ref: 'RecipozUser' }],
  followings: [{ type: ObjectId, ref: 'RecipozUser' }],
  addedRecipes: [{ type: ObjectId, ref: 'Recipe' }],
  favoriteRecipes: [{ type: ObjectId, ref: 'Recipe' }],
  triedRrecipes: [{ type: ObjectId, ref: 'Recipe' }],
  notifications: [{ type: ObjectId, ref: 'Notification' }],
  preferences: {
    recipeCategories: [{ type: ObjectId, ref: 'Category' }],
    cuisines: [{ type: ObjectId, ref: 'Cuisine' }],
    recentlyViewedRecipes: {
      type: [{ type: ObjectId, ref: 'Recipe' }],
      validate: [
        (v: string[]) => v.length <= 100,
        '{PATH} exceeds the limit of 100'
      ]
    }
  }
})

export const RecipozUser = mongoose.model<RecipozUserDocument>(
  'RecipozUser',
  recipozUserSchema
)
