import mongoose, { Document, Schema } from 'mongoose'
import { UserInputError as Error } from 'apollo-server-express'

import { i18n, supportedLanguages } from '../utils'
import { errorMessages } from '../constants'

export type NutrientDocument = Document & {
  name: {
    en?: string
    fr?: string
  }
  code: string
}

const nutrientSchema = new Schema({
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
  code: { type: String, unique: true }
})

nutrientSchema.index(
  { 'name.en': 'text', 'name.fr': 'text', code: 'text' },
  { weights: { 'name.en': 3, 'name.fr': 3, code: 2 } }
)

nutrientSchema.pre('validate', function validate(next) {
  const { name, code } = this as NutrientDocument
  const nameIsValid = supportedLanguages.some(
    lang => name[lang] && name[lang]?.trim()
  )

  if (!nameIsValid) {
    return next(new Error(i18n.t(errorMessages.nutrient.nameIsMandatory)))
  }

  if (!code || !code.trim()) {
    return next(new Error(i18n.t(errorMessages.nutrient.codeIsMandatory)))
  }

  return next()
})

export const Nutrient = mongoose.model<NutrientDocument>(
  'Nutrient',
  nutrientSchema
)
