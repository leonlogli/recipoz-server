import mongoose, { Schema, Document } from 'mongoose'

import { RecipeStepDocument, recipeStepSchema } from './RecipeStep'
import { CategoryDocument } from './Category'
import { CuisineDocument } from './Cuisine'
import { RecipeSourceDocument } from './RecipeSource'
import { CommentDocument } from './Comment'
import { RecipozUserDocument } from './RecipozUser'
import { MealTypeDocument } from './MealType'
import { MeasureUnitDocument } from './MeasureUnit'
import { IngredientDocument } from './Ingredient'
import { UtensilDocument } from './Utensil'
import { nutritionSchema, NutritionDocument } from './Nutrition'

const { ObjectId } = Schema.Types

const difficultyLevels = [
  'TOO_EASY',
  'EASY',
  'DIFFICULT',
  'VERY_DIFFICULT'
] as const

const costs = ['CHEAP', 'EXPENSIVE', 'VERY_EXPENSIVE'] as const

type RecipeIngredient = {
  ingredient: IngredientDocument
  quantity: number
  unit: MeasureUnitDocument
}

type RecipeUtensil = {
  utensil: UtensilDocument
  quantity: number
}

export type RecipeDocument = Document & {
  name: string
  description?: string
  image: string
  cuisines?: CuisineDocument[]
  servings?: number
  source?: {
    websiteSource: RecipeSourceDocument
    recipeUrl: string
  }
  readyInMinutes?: number
  steps: RecipeStepDocument[]
  categories?: CategoryDocument[]
  tags: string[]
  ingredients: RecipeIngredient[]
  utensils?: RecipeUtensil[]
  isPrivate?: boolean
  mealTypes?: MealTypeDocument
  difficultyLevel?: typeof difficultyLevels[number]
  cost?: typeof costs[number]
  additionalImages?: string[]
  nutrition?: NutritionDocument
  reviews?: CommentDocument[]
  reviewsCount: number
  poster?: RecipozUserDocument
  tryers?: RecipozUserDocument[]
  // transcient field
  totalTryers: number
  totalReviews: number
  totalfavorites: number
}

const recipeSchema = new Schema(
  {
    name: { type: String, required: 'Name is mandatory' },
    description: String,
    categories: [{ type: ObjectId, ref: 'Category' }],
    cuisines: [{ type: ObjectId, ref: 'Cuisine' }],
    source: {
      websiteSource: { type: ObjectId, ref: 'RecipeSource' },
      recipeUrl: String
    },
    image: { type: String, required: 'Image is mandatory' },
    servings: Number,
    readyInMinutes: Number,
    additionalImages: [String],
    steps: [recipeStepSchema],
    tags: {
      type: [String],
      required: 'Tags are mandatory',
      validate: [(v: string[]) => v.length < 6, '{PATH} exceeds the limit of 5']
    },
    ingredients: [
      {
        ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
        quantity: Number,
        unit: { type: mongoose.Schema.Types.ObjectId, ref: 'MeasureUnit' }
      }
    ],
    utensils: [
      {
        utensil: { type: mongoose.Schema.Types.ObjectId, ref: 'Utensil' },
        quantity: Number,
        unit: { type: mongoose.Schema.Types.ObjectId, ref: 'MeasureUnit' }
      }
    ],
    poster: { type: ObjectId, ref: 'RecipozUser' },
    tryers: [{ type: ObjectId, ref: 'RecipozUser' }],
    isPrivate: { type: Boolean, default: false },
    viewsCount: Number,
    mealTypes: [{ type: ObjectId, ref: 'MealType' }],
    difficultyLevel: { type: String, enum: difficultyLevels },
    cost: { type: String, enum: costs },
    nutrition: nutritionSchema,
    reviews: [{ type: ObjectId, ref: 'Comment' }]
  },
  { timestamps: true }
)

export const Recipe = mongoose.model<RecipeDocument>('Recipe', recipeSchema)
