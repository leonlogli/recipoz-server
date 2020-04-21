import mongoose, { Document, Schema } from 'mongoose'

import { AccountDocument } from './Account'
import { CommentDocument } from './Comment'

export type CommentReactionDocument = Document & {
  reaction: CommentReactionType
  account: AccountDocument
  comment: CommentDocument
}

const { ObjectId } = Schema.Types

const commentReaction = ['LIKE'] as const

export type CommentReactionType = typeof commentReaction[number]

const commentReactionSchema = new Schema({
  reaction: { type: String, enum: commentReaction },
  comment: { type: ObjectId, ref: 'Comment' },
  account: { type: ObjectId, ref: 'Account' }
})

commentReactionSchema.index({ comment: 1, account: 1 }, { unique: true })

export const CommentReaction = mongoose.model<CommentReactionDocument>(
  'CommentReaction',
  commentReactionSchema
)
export default CommentReaction
