import mongoose, { Document, Schema } from 'mongoose'
import { UserInputError as Error } from 'apollo-server-express'

import { i18n, supportedLanguages } from '../utils'
import { errorMessages } from '../constants'

const { ObjectId } = Schema.Types

export type CategoryDocument = Document & {
  parentCategory?: CategoryDocument
  name: {
    en?: string
    fr?: string
  }
  description?: {
    en?: string
    fr?: string
  }
  thumbnail: string
}

const categorySchema = new Schema({
  parentCategory: { type: ObjectId, ref: 'Category' },
  name: {
    en: {
      type: String,
      index: {
        unique: true,
        partialFilterExpression: { 'name.en': { $type: 'string' } }
      }
    },
    fr: {
      type: String,
      index: {
        unique: true,
        partialFilterExpression: { 'name.fr': { $type: 'string' } }
      }
    }
  },
  description: {
    en: String,
    fr: String
  },
  thumbnail: { type: String, required: 'Thumbnail is mandatory' }
})

categorySchema.index(
  {
    parentCategory: 'text',
    'name.en': 'text',
    'name.fr': 'text',
    'description.en': 'text'
  },
  {
    weights: {
      parentCategory: 1,
      name: 3,
      description: 2
    }
  }
)

categorySchema.pre('validate', function validate(next) {
  const { name } = this as CategoryDocument
  const isValid = supportedLanguages.some(lang => Boolean(name[lang]))

  return isValid
    ? next()
    : next(new Error(i18n.t(errorMessages.categoryNameIsMandatory)))
})

export const Category = mongoose.model<CategoryDocument>(
  'Category',
  categorySchema
)
export default Category
