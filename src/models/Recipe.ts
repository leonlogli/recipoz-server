import mongoose, { Document, Schema } from 'mongoose'
import {
  CategoryDocument,
  IngredientDocument,
  MeasureUnitDocument,
  NutritionDocument,
  nutritionSchema,
  RecipeSourceDocument,
  UserAccountDocument,
  UtensilDocument
} from '.'
import { recipeStepSchema, RecipeStepDocument } from './RecipeStep'

const { ObjectId } = Schema.Types

export const difficultyLevels = [
  'TOO_EASY',
  'EASY',
  'DIFFICULT',
  'VERY_DIFFICULT'
] as const

export type DifficultyLevel = typeof difficultyLevels[number]

export const costs = ['CHEAP', 'EXPENSIVE', 'VERY_EXPENSIVE'] as const

export type Cost = typeof costs[number]

export type RecipeIngredient = {
  ingredient: IngredientDocument
  quantity: number
  unit: MeasureUnitDocument
}

export type RecipeUtensil = {
  utensil: UtensilDocument
  quantity: number
}

export type RecipeDocument = Document & {
  name: string
  description?: string
  image: string
  servings?: number
  readyInMinutes?: number
  steps?: RecipeStepDocument[]
  categories?: CategoryDocument[]
  ingredients: RecipeIngredient[]
  utensils?: RecipeUtensil[]
  isPrivate?: boolean
  difficultyLevel?: DifficultyLevel
  cost?: Cost
  additionalImages?: string[]
  nutrition?: NutritionDocument
  poster?: UserAccountDocument
  source?: {
    websiteSource: RecipeSourceDocument
    recipeUrl: string
  }
}

const recipeSchema = new Schema(
  {
    name: { type: String, required: 'Name is mandatory' },
    description: String,
    categories: [{ type: ObjectId, ref: 'Category' }],
    image: { type: String, required: 'Image is mandatory' },
    servings: Number,
    readyInMinutes: Number,
    additionalImages: [String],
    steps: [recipeStepSchema],
    poster: { type: ObjectId, ref: 'UserAccount' },
    isPrivate: { type: Boolean, default: false },
    difficultyLevel: { type: String, enum: difficultyLevels },
    cost: { type: String, enum: costs },
    nutrition: nutritionSchema,
    source: {
      websiteSource: { type: ObjectId, ref: 'RecipeSource' },
      recipeUrl: String
    },
    utensils: [
      {
        utensil: { type: mongoose.Schema.Types.ObjectId, ref: 'Utensil' },
        quantity: Number,
        unit: { type: mongoose.Schema.Types.ObjectId, ref: 'MeasureUnit' }
      }
    ],
    ingredients: [
      {
        ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
        quantity: Number,
        unit: { type: mongoose.Schema.Types.ObjectId, ref: 'MeasureUnit' }
      }
    ]
  },
  { timestamps: true }
)

export const Recipe = mongoose.model<RecipeDocument>('Recipe', recipeSchema)
