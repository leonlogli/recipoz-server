import mongoose, { Document, Schema } from 'mongoose'

import {
  CategoryDocument,
  IngredientDocument,
  MeasureUnitDocument,
  NutritionDocument,
  nutritionSchema,
  SourceDocument,
  AccountDocument,
  UtensilDocument
} from '.'

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

export type RecipeStepDocument = {
  number: number
  instructions: string
  image?: string
}

export type RecipeSourceDocument = {
  source?: SourceDocument
  url?: string
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
  postedBy?: AccountDocument
  from?: RecipeSourceDocument
}

const recipeSchema = new Schema(
  {
    name: { type: String, required: 'Name is mandatory' },
    description: String,
    categories: [{ type: ObjectId, ref: 'Category' }],
    image: { type: String, required: 'Image is mandatory' },
    video: String,
    servings: Number,
    readyInMinutes: Number,
    additionalImages: [String],
    postedBy: { type: ObjectId, ref: 'Account' },
    isPrivate: { type: Boolean, default: false },
    difficultyLevel: { type: String, enum: difficultyLevels },
    cost: { type: String, enum: costs },
    nutrition: nutritionSchema,
    from: {
      source: { type: ObjectId, ref: 'Source' },
      url: String
    },
    steps: [
      {
        number: { type: Number, required: 'Step number is mandatory' },
        instructions: { type: String, required: 'Instruction is mandatory' },
        image: String
      }
    ],
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
