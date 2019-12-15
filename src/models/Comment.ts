import mongoose, { Schema, Document } from 'mongoose'

import { UserAccountDocument, RecipeDocument } from '.'

const { ObjectId } = Schema.Types

/**
 * Comment reaction types
 */
const reactionTypes = ['LIKE', 'LOVE', 'APPLAUD', 'LAUGH', 'CONFUSED'] as const

type CommentReaction = {
  type: typeof reactionTypes[number]
  user: UserAccountDocument
}

export interface CommentDocument extends Document {
  user: UserAccountDocument
  data: RecipeDocument
  content: string
  attachmentUrl?: string
  rating?: number
  replies?: CommentDocument[]
  reactions?: CommentReaction[]
  mentionedUsers?: UserAccountDocument[]
}

const commentSchema = new Schema(
  {
    user: { type: ObjectId, ref: 'UserAccount' },
    data: { type: ObjectId, ref: 'Recipe' },
    rating: Number,
    content: { type: String, required: 'Content is mandatory' },
    attachmentUrl: String,
    abuseRapporteurs: [{ type: ObjectId, ref: 'UserAccount' }],
    mentionedUsers: [{ type: ObjectId, ref: 'UserAccount' }],
    reactions: [
      {
        type: { type: String, enum: reactionTypes, default: reactionTypes[0] },
        user: { type: ObjectId, ref: 'UserAccount', required: true }
      }
    ]
  },
  { timestamps: true }
)

commentSchema.add({ replies: [commentSchema] })

export const Comment = mongoose.model<CommentDocument>('Comment', commentSchema)
export default Comment
