import mongoose, { Document, Schema } from 'mongoose'
import { UserInputError as Error } from 'apollo-server-express'

import { i18n } from '../utils'
import { errorMessages } from '../constants'

/**
 * Recipe source ie where recipe is originally published
 */
export type SourceDocument = Document & {
  name: string
  website: string
}

const sourceSchema = new Schema({
  name: { type: String, unique: true },
  website: { type: String, unique: true }
})

sourceSchema.index(
  { name: 'text', website: 'text' },
  { weights: { name: 3, website: 2 } }
)

sourceSchema.pre('validate', function validate(next) {
  const { name, website } = this as SourceDocument

  if (!name || !name.trim()) {
    return next(new Error(i18n.t(errorMessages.source.nameIsMandatory)))
  }

  if (!website || !website.trim()) {
    return next(new Error(i18n.t(errorMessages.source.websiteIsMandatory)))
  }

  return next()
})

export const Source = mongoose.model<SourceDocument>('Source', sourceSchema)
