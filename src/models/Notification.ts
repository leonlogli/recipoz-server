import mongoose, { Document, Schema } from 'mongoose'

import { CommentDocument, RecipeDocument, AccountDocument } from '.'

const { ObjectId } = Schema.Types

export const notificationCodes = [
  'COMMENTS',
  'TAGS',
  'LIKES',
  'NEW_FOLLOWERS',
  'RECIPES'
] as const

export const notificationDataTypes = [
  'Comment',
  'Recipe',
  'Account',
  'RecipeSource',
  'Category'
] as const

export type NotificationDataType = typeof notificationDataTypes[number]

export type NotificationCode = typeof notificationCodes[number]

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
