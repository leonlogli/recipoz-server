import mongoose, { Document, Schema } from 'mongoose'
import { UserInputError as Error } from 'apollo-server-express'

import { i18n, supportedLanguages } from '../utils'
import { errorMessages } from '../constants'

const subCategories = [
  'MEAL_TYPE',
  'DIET',
  'DISH_TYPE',
  'SEASONAL',
  'COOKING_STYLE',
  'HEALTH',
  'CUISINE'
] as const

export type CategoryDocument = Document & {
  subCategory?: {
    type: typeof subCategories[number]
    thumbnail?: string
  }
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
  subCategory: {
    type: { type: String, enum: subCategories },
    thumbnail: String
  },
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
    'subCategory.type': 'text',
    'name.en': 'text',
    'name.fr': 'text',
    'description.en': 'text'
  },
  {
    weights: {
      'subCategory.type': 3,
      name: 2,
      description: 1
    }
  }
)

categorySchema.pre('validate', function validate(next) {
  const { name } = this as CategoryDocument
  const isValid = supportedLanguages.some(lang => Boolean(name[lang]))

  return isValid
    ? next()
    : next(new Error(i18n.t(errorMessages.categoryName.isMandatory)))
})

export const Category = mongoose.model<CategoryDocument>(
  'Category',
  categorySchema
)
export default Category
