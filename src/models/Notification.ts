import mongoose, { Document, Schema } from 'mongoose'

import { CommentDocument, RecipeDocument, AccountDocument } from '.'

const { ObjectId } = Schema.Types

const notificationCodes = [
  'MY_RECIPE_IS_COMMENTED',
  'SOMEONE_REPLIED_TO_MY_COMMENT',
  'I_AM_MENTIONED_IN_COMMENT',
  'SOMEONE_REACTED_TO_MY_COMMENT',
  'I_HAVE_NEW_FOLLOWER',
  'MY_FOLLOWER_PUBLISHES_RECIPE'
] as const

const notificationTypes = ['PUSH', 'EMAIL', 'ON_APP'] as const

export type NotificationCode = typeof notificationCodes[number]

export type NotificationType = typeof notificationTypes[number]

export type NotificationDocument = Document & {
  code: NotificationCode
  actor: AccountDocument
  me: AccountDocument
  data: CommentDocument | RecipeDocument
  unread: boolean
}

const notificationSchema = new Schema(
  {
    code: { type: String, enum: notificationCodes },
    me: { type: ObjectId, ref: 'Account' },
    actor: { type: ObjectId, ref: 'Account' },
    unread: { type: Boolean, default: true },
    data: { type: ObjectId, refPath: 'dataModel' },
    dataModel: { type: String, required: true, enum: ['Comment', 'Recipe'] }
  },
  { timestamps: true }
)

const Notification = mongoose.model<NotificationDocument>(
  'Notification',
  notificationSchema
)

export { notificationTypes, notificationCodes, Notification }
