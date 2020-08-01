import mongoose, { Document, Schema } from 'mongoose'

import { AccountDocument, CategoryDocument, RecipeSourceDocument } from '.'
import { createTextIndex } from '../utils'

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

export type Instruction = {
  step: number
  text: string
  image?: string
}

export type Ingredient = {
  quantity: string
  name: string
  group: string
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
  author: AccountDocument
  source?: RecipeSourceDocument
  sourceLink?: string
  instructions?: Instruction[]
  categories: CategoryDocument[]
  ingredients: Ingredient[]
  private: boolean
  additionalImages?: string[]
  tips?: string
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
    author: { type: ObjectId, ref: 'Account' },
    source: { type: ObjectId, ref: 'RecipeSource' },
    sourceLink: String,
    private: Boolean,
    difficultyLevel: { type: String, enum: difficultyLevels },
    cost: { type: String, enum: costs },
    ingredients: [{ quantity: String, name: String, group: String }],
    instructions: [{ step: Number, text: String, image: String }],
    tips: String,
    _tags: [String]
  },
  { timestamps: true }
)

const { indexes, weights } = createTextIndex(
  'name',
  'description',
  'instructions.text',
  'ingredients.text'
)

recipeSchema.index(indexes, { weights })

// For the frequent access
recipeSchema.index({ author: 1 })
recipeSchema.index({ categories: 1 })
recipeSchema.index(
  { source: 1 },
  { partialFilterExpression: { source: { $exists: true } } }
)

// Index for cursor based pagination (because we allow recipes to be order by 'createdAt')
recipeSchema.index({ createdAt: 1, _id: 1 })

// Autocomplete tags index
recipeSchema.index(
  { _tags: 1 },
  { partialFilterExpression: { '_tags.0': { $exists: true } } }
)

recipeSchema.pre('save', function save(next) {
  const { instructions } = this as RecipeDocument

  if (instructions) {
    instructions.forEach((step, i) => {
      step.step = i + 1
    })
  }

  return next()
})

export const Recipe = mongoose.model<RecipeDocument>('Recipe', recipeSchema)
