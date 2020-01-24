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
    'name.en': 'text',
    'name.fr': 'text',
    'description.en': 'text',
    'description.fr': 'text'
  },
  {
    weights: {
      'name.en': 3,
      'name.fr': 3,
      'description.en': 2,
      'description.fr': 2
    }
  }
)

categorySchema.pre('validate', function validate(next) {
  const { name, thumbnail } = this as CategoryDocument
  const nameIsValid = supportedLanguages.some(
    lang => name[lang] && name[lang]?.trim()
  )

  if (!nameIsValid) {
    return next(new Error(i18n.t(errorMessages.category.nameIsMandatory)))
  }

  if (!thumbnail || !thumbnail.trim()) {
    return next(new Error(i18n.t(errorMessages.category.thumbnailIsMandatory)))
  }

  return next()
})

export const Category = mongoose.model<CategoryDocument>(
  'Category',
  categorySchema
)
export default Category
