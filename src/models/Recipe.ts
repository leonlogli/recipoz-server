import mongoose, { Document, Schema } from 'mongoose'

import {
  AccountDocument,
  CategoryDocument,
  NutritionDocument,
  nutritionSchema,
  RecipeSourceDocument
} from '.'
import { createTextIndex } from '../utils/schemaUtils'

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

export type Step = {
  number: number
  instruction: string
  image?: string
}

export type Ingredient = {
  quantity: number
  unit: string
  name: string
}

export type RecipeDocument = Document & {
  name: string
  description?: string
  image: string
  servings: number
  cookTime: number
  prepTime: number
  difficultyLevel: DifficultyLevel
  cost: Cost
  author: RecipeSourceDocument | AccountDocument
  sourceUrl: string
  steps?: Step[]
  categories?: CategoryDocument[]
  ingredients: Ingredient[]
  private: boolean
  additionalImages?: string[]

  tips?: string
  nutrition?: NutritionDocument
}

const recipeSchema = new Schema(
  {
    name: String,
    description: String,
    image: String,
    video: String,
    servings: Number,
    cookTime: Number,
    prepTime: Number,
    additionalImages: [String],
    categories: [{ type: ObjectId, ref: 'Category' }],
    sourceUrl: String,
    author: { type: ObjectId, refPath: 'authorType' },
    authorType: { type: String, enum: ['Account', 'RecipeSource'] },
    private: Boolean,
    difficultyLevel: { type: String, enum: difficultyLevels },
    cost: { type: String, enum: costs },
    ingredients: [{ quantity: Number, unit: String, name: String }],
    steps: [{ number: Number, instruction: String, image: String }],
    tips: String,
    nutrition: nutritionSchema
  },
  { timestamps: true }
)

const { indexes, weights } = createTextIndex(
  'name',
  'description',
  'steps.instruction',
  'ingredients.name'
)

recipeSchema.index(indexes, { weights })

recipeSchema.pre('save', function save(next) {
  const { steps } = this as RecipeDocument

  if (steps) {
    steps.forEach((step, i) => {
      step.number = i + 1
    })
  }

  return next()
})

export const Recipe = mongoose.model<RecipeDocument>('Recipe', recipeSchema)
