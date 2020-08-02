import mongoose, { Document, Schema } from 'mongoose'

import { createTextIndex, I18NString, I18NUniqueString } from '../utils'

export const categoryGroups = [
  'COURSE', // OR MEAL
  'HEALTH',
  'PREPARATION_METHOD',
  'CUISINE',
  'INGREDIENT',
  'SEASONAL',
  'OTHER'
] as const

export type CategoryGroup = typeof categoryGroups[number]

export type CategoryDocument = Document & {
  group?: CategoryDocument
  name: string
  description?: string
  thumbnail: string
}

const categorySchema = new Schema({
  group: { type: String, enum: categoryGroups },
  name: I18NUniqueString('name'),
  description: I18NString,
  thumbnail: String,
  _tags: [String]
})

const { indexes, weights } = createTextIndex('name.*', 'group', 'description.*')

categorySchema.index(indexes, { weights })

// For the frequent access
categorySchema.index({ group: 1 })

// Autocomplete tags index
categorySchema.index(
  { _tags: 1 },
  { partialFilterExpression: { '_tags.0': { $exists: true } } }
)

export const Category = mongoose.model<CategoryDocument>(
  'Category',
  categorySchema
)
export default Category
