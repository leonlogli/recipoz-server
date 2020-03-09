import mongoose, { Document, Schema } from 'mongoose'

import { createTextIndex, I18NString, I18NUniqueString } from '../utils'

export type CategoryDocument = Document & {
  parentCategory?: CategoryDocument
  name: string
  description?: string
  thumbnail: string
}

const { ObjectId } = Schema.Types

const categorySchema = new Schema({
  parentCategory: { type: ObjectId, ref: 'Category' },
  name: I18NUniqueString('name'),
  description: I18NString,
  thumbnail: String,
  _tags: [String]
})

const { indexes, weights } = createTextIndex('name.*', 'description.*')

categorySchema.index(indexes, { weights })
categorySchema.index(
  { _tags: 1 },
  { partialFilterExpression: { _tags: { $exists: true } } }
)

export const Category = mongoose.model<CategoryDocument>(
  'Category',
  categorySchema
)
export default Category
