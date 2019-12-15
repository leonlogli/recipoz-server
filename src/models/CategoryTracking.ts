import mongoose, { Document, Schema } from 'mongoose'

import { CategoryDocument } from '.'
import { UserAccountDocument } from './UserAccount'

const { ObjectId } = Schema.Types

export type CategoryTrackingDocument = Document & {
  user: UserAccountDocument
  category: CategoryDocument
  viewCount: number
}

const categoryTrackingSchema = new Schema({
  user: { type: ObjectId, ref: 'UserAccount' },
  category: { type: ObjectId, ref: 'Category' },
  viewCount: Number
})

export const CategoryTracking = mongoose.model<CategoryTrackingDocument>(
  'CategoryTracking',
  categoryTrackingSchema
)
