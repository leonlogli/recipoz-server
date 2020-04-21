import mongoose, { Schema, Document } from 'mongoose'

import { AccountDocument, RecipeDocument } from '.'
import { CategoryDocument } from './Category'

const { ObjectId } = Schema.Types

export type CommentDocument = Document & {
  author: AccountDocument
  topic: CategoryDocument | RecipeDocument
  content: string
  attachmentUrl?: string
  rating?: number
  mentionedAccounts?: AccountDocument[]
}

export const commentTopics = ['Recipe', 'Comment'] as const

export type Commenttopic = typeof commentTopics[number]

const commentSchema = new Schema(
  {
    author: { type: ObjectId, ref: 'Account' },
    topic: { type: ObjectId, refPath: 'topicType' },
    topicType: { type: String, enum: commentTopics },
    rating: Number,
    content: String,
    attachmentUrl: String,
    mentionedAccounts: [{ type: ObjectId, ref: 'Account' }]
  },
  { timestamps: true }
)

// Required for cursor based pagination (because we allow comment to be order by 'createdAt' and 'rating')
commentSchema.index({ createdAt: 1, _id: 1 })
commentSchema.index({ rating: 1, _id: 1 })

// For frequent access
commentSchema.index({ topic: 1, topicType: 1 })

export const Comment = mongoose.model<CommentDocument>('Comment', commentSchema)
export default Comment
