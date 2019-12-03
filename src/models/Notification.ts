import mongoose, { Schema, Document } from 'mongoose'
import { CommentDocument } from './Comment'
import { RecipeDocument } from './Recipe'
import { RecipozUserDocument } from './RecipozUser'

const { ObjectId } = Schema.Types

const notificationTypes = [
  'YOUR_RECIPE_IS_COMMENTED',
  'SOMEONE_REPLiED_TO_YOUR_COMMENT',
  'YOU_ARE_IDENTIFIED_IN_COMMENT',
  'SOMEONE_REACTED_TO_YOUR_COMMENT',
  'YOU_HAVE_NEW_FOLLOWER',
  'FOLLOWER_PUBLISHES_RECIPE'
] as const

export type NotificationDocument = Document & {
  /**
   * The notification type
   */
  notificationType: typeof notificationTypes[number]
  /**
   * The target user
   */
  sourceUser: RecipozUserDocument
  /**
   * The target comment
   */
  comment?: CommentDocument
  /**
   * The target recipe
   */
  recipe?: RecipeDocument
  unread: boolean
}

const notificationSchema = new Schema(
  {
    notificationType: { type: String, enum: notificationTypes },
    sourceUser: { type: ObjectId, ref: 'RecipozUser' },
    comment: { type: ObjectId, ref: 'Comment' },
    recipe: { type: ObjectId, ref: 'Recipe' },
    unread: { type: Boolean, default: true }
  },
  { timestamps: true }
)

export const Notification = mongoose.model<NotificationDocument>(
  'Notification',
  notificationSchema
)
