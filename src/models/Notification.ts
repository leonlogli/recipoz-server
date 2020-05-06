import mongoose, { Document, Schema } from 'mongoose'

import { CommentDocument, RecipeDocument, AccountDocument } from '.'

const { ObjectId } = Schema.Types

export const notificationCodes = [
  'MY_RECIPE_IS_COMMENTED',
  'SOMEONE_REPLIED_TO_MY_COMMENT',
  'SOMEONE_MENTIONED_ME',
  'MY_COMMENT_IS_LIKED',
  'SOMEONE_STARTED_FOLLOWING_ME',
  'NEW_RECIPE_FROM_MY_FOLLOWING'
] as const

export const notificationDataTypes = ['Comment', 'Recipe', 'Account'] as const

export type NotificationDataType = typeof notificationDataTypes[number]

export type NotificationCode = typeof notificationCodes[number]

export const notificationTypes = ['PUSH', 'EMAIL'] as const

export type NotificationType = typeof notificationTypes[number]

export type NotificationDocument = Document & {
  code: NotificationCode
  recipient: AccountDocument
  dataType: NotificationDataType
  data: CommentDocument | RecipeDocument | AccountDocument
  read?: boolean
}

const notificationSchema = new Schema(
  {
    code: { type: String, enum: notificationCodes },
    recipient: { type: ObjectId, ref: 'Account' },
    data: { type: ObjectId, refPath: 'dataType' },
    dataType: { type: String, enum: notificationDataTypes },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
)

notificationSchema.index(
  { recipient: 1, data: 1, dataType: 1, code: 1 },
  { unique: true }
)

export const Notification = mongoose.model<NotificationDocument>(
  'Notification',
  notificationSchema
)
export default Notification
