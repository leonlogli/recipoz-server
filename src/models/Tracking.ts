import mongoose, { Document, Schema } from 'mongoose'

import { CategoryDocument } from '.'
import { AccountDocument } from './Account'
import { RecipeDocument } from './Recipe'

const { ObjectId } = Schema.Types

export type TrackingDocument = Document & {
  user: AccountDocument
  data: CategoryDocument | RecipeDocument
  viewCount: number
}

const trackingSchema = new Schema({
  user: { type: ObjectId, ref: 'Account' },
  data: { type: Schema.Types.ObjectId, required: true, refPath: 'dataModel' },
  dataModel: { type: String, required: true, enum: ['Category', 'Recipe'] },
  viewCount: { type: Number, default: 0 }
})

export const Tracking = mongoose.model<TrackingDocument>(
  'Tracking',
  trackingSchema
)
