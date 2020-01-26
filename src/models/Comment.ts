import mongoose, { Schema, Document } from 'mongoose'

import { AccountDocument, RecipeDocument } from '.'
import { CategoryDocument } from './Category'

const { ObjectId } = Schema.Types

/**
 * Comment reaction types
 */
const reactionTypes = ['LIKE', 'LOVE', 'APPLAUD', 'LAUGH', 'CONFUSED'] as const

type CommentReaction = {
  type: typeof reactionTypes[number]
  user: AccountDocument
}

export type CommentDocument = Document & {
  author: AccountDocument
  onData: CategoryDocument | RecipeDocument
  content?: string
  attachmentUrl?: string
  rating?: number
  inReplyTo?: CommentDocument
  reactions?: CommentReaction[]
  mentionedUsers?: AccountDocument[]
}

const commentSchema = new Schema(
  {
    author: { type: ObjectId, ref: 'Account' },
    onData: { type: ObjectId, required: true, refPath: 'onDataModel' },
    onDataModel: { type: String, required: true, enum: ['Category', 'Recipe'] },
    rating: Number,
    content: String,
    attachmentUrl: String,
    abuseRapporteurs: [{ type: ObjectId, ref: 'Account' }],
    inReplyTo: { type: ObjectId, ref: 'Comment' },
    mentionedUsers: [{ type: ObjectId, ref: 'Account' }],
    reactions: [
      {
        type: { type: String, enum: reactionTypes },
        user: { type: ObjectId, ref: 'Account', required: true }
      }
    ]
  },
  { timestamps: true }
)

export const Comment = mongoose.model<CommentDocument>('Comment', commentSchema)
export default Comment
