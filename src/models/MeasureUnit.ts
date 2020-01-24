import mongoose from 'mongoose'
import { UserInputError as Error } from 'apollo-server-express'

import { supportedLanguages, i18n } from '../utils'
import { errorMessages } from '../constants'

export type MeasureUnitDocument = mongoose.Document & {
  name: {
    en?: string
    fr?: string
  }
  description?: {
    en?: string
    fr?: string
  }
}

const measureUnitSchema = new mongoose.Schema({
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
  }
})

measureUnitSchema.index(
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

measureUnitSchema.pre('validate', function validate(next) {
  const { name } = this as MeasureUnitDocument
  const isValid = supportedLanguages.some(lang => Boolean(name[lang]))

  return isValid
    ? next()
    : next(new Error(i18n.t(errorMessages.category.nameIsMandatory)))
})

export const MeasureUnit = mongoose.model<MeasureUnitDocument>(
  'MeasureUnit',
  measureUnitSchema
)
