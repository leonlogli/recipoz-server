import mongoose from 'mongoose'
import { errorMessages } from '../constants'
import { supportedLanguages, i18n } from '../utils'

export type IngredientDocument = mongoose.Document & {
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
  const { name } = this as IngredientDocument
  const isValid = supportedLanguages.some(lang => Boolean(name[lang]))

  return isValid
    ? next()
    : next(new Error(i18n.t(errorMessages.ingredientNameIsMandatory)))
})

export const Ingredient = mongoose.model<IngredientDocument>(
  'Ingredient',
  ingredientSchema
)
