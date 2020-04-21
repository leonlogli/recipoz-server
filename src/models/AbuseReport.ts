import mongoose, { Document, Schema } from 'mongoose'

import { AccountDocument } from './Account'
import { RecipeDocument } from './Recipe'
import { CommentDocument } from './Comment'

const { ObjectId } = Schema.Types

export type AbuseReportDocument = Document & {
  type: AbuseType
  /**
   * Account that reports the abuse
   */
  author: AccountDocument
  /**
   * The reported data
   */
  data: CommentDocument | RecipeDocument | AccountDocument
  /**
   * Type of data to report
   */
  dataType: AbuseReportDataType
  status: AbuseReportStatus
}

export const abuseTypes = [
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

export const abuseReportDataTypes = ['Account', 'Comment', 'Recipe'] as const

export type AbuseType = typeof abuseTypes[number]

export type AbuseReportDataType = typeof abuseReportDataTypes[number]

export const abuseReportStatus = ['PENDING', 'APPROVED', 'IGNORED'] as const

export type AbuseReportStatus = typeof abuseReportStatus[number]

const abuseReportSchema = new Schema(
  {
    type: { type: String, enum: abuseTypes },
    author: { type: ObjectId, ref: 'Account' },
    data: { type: ObjectId, refPath: 'dataType' },
    dataType: { type: String, enum: abuseReportDataTypes },
    status: { type: String, enum: abuseReportStatus, default: 'PENDING' }
  },
  { timestamps: true }
)

// Required for cursor based pagination (because we allow abuse reports to be order by 'createdAt')
abuseReportSchema.index({ createdAt: 1, _id: 1 })

abuseReportSchema.index({ dataType: 1, data: 1, author: 1 }, { unique: true })

export const AbuseReport = mongoose.model<AbuseReportDocument>(
  'AbuseReport',
  abuseReportSchema
)
export default AbuseReport
