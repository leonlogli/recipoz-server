import mongoose, { Document } from 'mongoose'
import { UserInputError as Error } from 'apollo-server-express'

import { errorMessages } from '../constants'
import { supportedLanguages, i18n } from '../utils'

export type IngredientDocument = Document & {
  name: {
    en?: string
    fr?: string
  }
  description?: {
    en?: string
    fr?: string
  }
  image: string
}

const ingredientSchema = new mongoose.Schema({
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
  image: { type: String, required: 'Image is mandatory' }
})

ingredientSchema.index(
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

ingredientSchema.pre('validate', function validate(next) {
  const { name, image } = this as IngredientDocument
  const nameIsValid = supportedLanguages.some(
    lang => name[lang] && name[lang]?.trim()
  )

  if (!nameIsValid) {
    return next(new Error(i18n.t(errorMessages.ingredient.nameIsMandatory)))
  }

  if (!image || !image.trim()) {
    return next(new Error(i18n.t(errorMessages.ingredient.imageIsMandatory)))
  }

  return next()
})

export const Ingredient = mongoose.model<IngredientDocument>(
  'Ingredient',
  ingredientSchema
)
