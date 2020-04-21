import mongoose, { Document, Schema } from 'mongoose'

import { createTextIndex, I18NString, I18NUniqueString } from '../utils'

const { ObjectId } = Schema.Types

export type CategoryDocument = Document & {
  parent?: CategoryDocument
  name: string
  description?: string
  thumbnail: string
}

const categorySchema = new Schema({
  parent: { type: ObjectId, ref: 'Category' },
  name: I18NUniqueString('name'),
  description: I18NString,
  thumbnail: String,
  // Autocomplete words
  _tags: [String]
})

const { indexes, weights } = createTextIndex('name.*', 'description.*')

categorySchema.index(indexes, { weights })

categorySchema.index(
  { _tags: 1 },
  { partialFilterExpression: { '_tags.0': { $exists: true } } }
)

export const Category = mongoose.model<CategoryDocument>(
  'Category',
  categorySchema
)
export default Category
