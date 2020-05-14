import { logger } from '../../config'
import {
  AccountDocument,
  Notification,
  NotificationDocument
} from '../../models'
import { DataLoaders, errorRes, i18n, locales } from '../../utils'
import { ModelService } from '../base'
import { sendNotification } from './notificationManager'
import { NotificationInput } from './notificationServiceHelper'
import {
  deleteOldNotifications,
  deleteNotifications
} from './deleteNotifications'

const { statusMessages, errorMessages } = locales
const { notFound } = errorMessages.notification
const { updated, deleted } = statusMessages.notification
const { t } = i18n

const notificationModel = new ModelService<NotificationDocument>({
  model: Notification,
  onNotFound: notFound
})

const countNotifications = notificationModel.countByBatch
const getNotifications = notificationModel.findByIds
const getNotificationsByBatch = notificationModel.batchFind
const getNotificationAndSelect = notificationModel.findOne

const addNotification = async (
  input: NotificationInput,
  loaders: DataLoaders
) => {
  try {
    const { recipient, data, dataType, code } = input
    const query = { recipient, data, dataType, code }
    const set = { $set: { ...input, read: false } }

    const notification = await notificationModel.createOrUpdate(query, set)

    await sendNotification(input, loaders)
    await deleteOldNotifications(notification.recipient)
  } catch (error) {
    logger.error('Error adding new notification: ', error)
  }
}

const addNotifications = (
  input: Omit<NotificationInput, 'recipient'>,
  recipients: (string | AccountDocument)[],
  loaders: DataLoaders
) => {
  const promises = recipients.map((account: any) =>
    addNotification({ ...input, recipient: account._id || account }, loaders)
  )

  return Promise.all(promises)
}

const suitableErrorResponse = async (notificationId: any) => {
  const exists = await notificationModel.exists(notificationId)
  const message = t(exists ? errorMessages.forbidden : notFound)

  return { success: false, message, code: exists ? 403 : 404 }
}

const updateNotification = async (
  input: NotificationInput & { id: string },
  loaders: DataLoaders
) => {
  try {
    const { id: _id, recipient, ...data } = input
    const set = { $set: data }
    const query = { _id, recipient }

    const notification = await notificationModel.updateOne(query, set, loaders)
    const res = { success: true, message: t(updated), code: 200, notification }

    return notification ? res : suitableErrorResponse(_id)
  } catch (error) {
    return errorRes(error)
  }
}

const markAllNotificationsAsRead = async (accountId: any) => {
  try {
    const query = { recipient: accountId, read: false }
    const data = { $set: { read: false } }

    const res = await Notification.updateMany(query, data).exec()
    const mutatedCount = res.mutatedCount || 0
    const success = mutatedCount > 0
    const message = t(success ? updated : notFound)

    return { success, message, code: success ? 200 : 404, mutatedCount }
  } catch (error) {
    return errorRes(error)
  }
}

const deleteNotification = async (input: { id: string; recipient: string }) => {
  try {
    const { id: _id, recipient } = input

    const notification = await notificationModel.deleteOne({ _id, recipient })
    const res = { success: true, message: t(deleted), code: 200, notification }

    return notification ? res : suitableErrorResponse(_id)
  } catch (error) {
    return errorRes(error)
  }
}

export const notificationService = {
  getNotifications,
  countNotifications,
  getNotificationsByBatch,
  getNotificationAndSelect,
  addNotification,
  deleteNotification,
  updateNotification,
  markAllNotificationsAsRead,
  deleteNotifications,
  addNotifications
}
export default notificationService
