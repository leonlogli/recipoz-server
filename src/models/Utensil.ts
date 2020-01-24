import mongoose, { Document } from 'mongoose'
import { UserInputError as Error } from 'apollo-server-express'

import { i18n, supportedLanguages } from '../utils'
import { errorMessages } from '../constants'

export type UtensilDocument = Document & {
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

const utensilSchema = new mongoose.Schema({
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

utensilSchema.index(
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

utensilSchema.pre('validate', function validate(next) {
  const { name, image } = this as UtensilDocument
  const nameIsValid = supportedLanguages.some(
    lang => name[lang] && name[lang]?.trim()
  )

  if (!nameIsValid) {
    return next(new Error(i18n.t(errorMessages.utensil.nameIsMandatory)))
  }

  if (!image || !image.trim()) {
    return next(new Error(i18n.t(errorMessages.utensil.imageIsMandatory)))
  }

  return next()
})

export const Utensil = mongoose.model<UtensilDocument>('Utensil', utensilSchema)
