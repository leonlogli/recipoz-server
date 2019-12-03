import mongoose, { Schema, Document } from 'mongoose'

import { RecipozUserDocument } from './RecipozUser'

const { ObjectId } = Schema.Types

/**
 * Comment reaction types
 */
const reactionTypes = ['LIKE', 'LOVE', 'APPLAUD', 'LAUGH', 'CONFUSED'] as const

type CommentReaction = {
  type: typeof reactionTypes[number]
  user: RecipozUserDocument
}

export interface CommentDocument extends Document {
  user: RecipozUserDocument
  content: string
  attachmentUrl?: string
  rating?: number
  replies?: CommentDocument[]
  reactions?: CommentReaction[]
  mentionedUsers?: RecipozUserDocument[]
  // unsaved fields
  totalReplies: number
  totalReactions: number
}

const commentSchema = new Schema(
  {
    user: { type: ObjectId, ref: 'RecipozUser' },
    rating: Number,
    content: { type: String, required: 'Content is mandatory' },
    attachmentUrl: String,
    abuseRapporteurs: [{ type: ObjectId, ref: 'RecipozUser' }],
    mentionedUsers: [{ type: ObjectId, ref: 'RecipozUser' }],
    reactions: [
      {
        type: { type: String, enum: reactionTypes, default: reactionTypes[0] },
        user: { type: ObjectId, ref: 'RecipozUser' }
      }
    ]
  },
  { timestamps: true }
)

commentSchema.add({ replies: [commentSchema] })

export { commentSchema }

export const Comment = mongoose.model<CommentDocument>('Comment', commentSchema)
