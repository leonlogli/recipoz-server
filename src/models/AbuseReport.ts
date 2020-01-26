import mongoose, { Document, Schema } from 'mongoose'

import { CategoryDocument } from '.'
import { AccountDocument } from './Account'
import { RecipeDocument } from './Recipe'

const { ObjectId } = Schema.Types

/**
 * Abuse types
 */
const abuseTypes = [
  'RUDE',
  'HARASSMENT',
  'ADULT_CONTENT',
  'HATE_SPEECH',
  'UNDESIRABLE_CONTENT',
  'VIOLENCE',
  'INTIMIDATION',
  'COPYRIGHT_ISSUE',
  'INAPPROPRIATE'
] as const

export type AbuseReportDocument = Document & {
  type: typeof abuseTypes[number]
  user: AccountDocument
  onData: CategoryDocument | RecipeDocument
}

const abuseReportSchema = new Schema({
  type: { type: String, enum: abuseTypes },
  user: { type: ObjectId, ref: 'Account' },
  onData: { type: ObjectId, required: true, refPath: 'onDataModel' },
  onDataModel: { type: String, required: true, enum: ['Comment', 'Recipe'] }
})

export const AbuseReport = mongoose.model<AbuseReportDocument>(
  'AbuseReport',
  abuseReportSchema
)
