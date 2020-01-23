import mongoose, { Document, Schema } from 'mongoose'

import { CommentDocument, RecipeDocument, UserAccountDocument } from '.'

const { ObjectId } = Schema.Types

export const notificationTypes = [
  'MY_RECIPE_IS_COMMENTED',
  'SOMEONE_REPLIED_TO_MY_COMMENT',
  'I_AM_MENTIONED_IN_COMMENT',
  'SOMEONE_REACTED_TO_MY_COMMENT',
  'I_HAVE_NEW_FOLLOWER',
  'MY_FOLLOWER_PUBLISHES_RECIPE'
] as const

export type NotificationType = typeof notificationTypes[number]

export type NotificationDocument = Document & {
  type: NotificationType
  actor: UserAccountDocument
  me: UserAccountDocument
  data: CommentDocument | RecipeDocument
  unread: boolean
}

const notificationSchema = new Schema(
  {
    type: { type: String, enum: notificationTypes },
    me: { type: ObjectId, ref: 'UserAccount' },
    actor: { type: ObjectId, ref: 'UserAccount' },
    unread: { type: Boolean, default: true },
    data: { type: ObjectId, refPath: 'dataModel' },
    dataModel: { type: String, required: true, enum: ['Comment', 'Recipe'] }
  },
  { timestamps: true }
)

export const Notification = mongoose.model<NotificationDocument>(
  'Notification',
  notificationSchema
)
