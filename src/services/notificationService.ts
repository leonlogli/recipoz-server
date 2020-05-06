import { Notification, NotificationDocument } from '../models'
import { i18n, DataLoaders, errorRes, locales } from '../utils'
import ModelService from './base/ModelService'
import { logger } from '../config'

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

const addNotification = async (input: Partial<NotificationDocument>) => {
  const { recipient, data, dataType, code } = input
  const query = { recipient, data, dataType, code }

  return notificationModel
    .createOrUpdate(query, { $set: { ...data, read: false } })
    .then(res => res)
    .catch(error => {
      logger.error('Error adding new notification: ', error)

      return null
    })
}

const suitableErrorResponse = async (notificationId: any) => {
  const exists = await notificationModel.exists(notificationId)
  const message = t(exists ? errorMessages.forbidden : notFound)

  return { success: false, message, code: exists ? 403 : 404 }
}

const updateNotification = async (input: any, loaders: DataLoaders) => {
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

const deleteNotification = async (input: any) => {
  try {
    const { id: _id, recipient } = input
    const notification = await notificationModel.deleteOne({ _id, recipient })
    const res = { success: true, message: t(deleted), code: 200, notification }

    return notification ? res : suitableErrorResponse(_id)
  } catch (error) {
    return errorRes(error)
  }
}

const deleteNotifications = async (accountId: string) => {
  return Notification.deleteMany({ recipient: accountId } as any)
    .exec()
    .catch(e =>
      logger.error(`Error deleting account (${accountId}) notifications: `, e)
    )
}

export const notificationService = {
  getNotifications,
  countNotifications,
  getNotificationsByBatch,
  getNotificationAndSelect,
  addNotification,
  deleteNotification,
  updateNotification,
  deleteNotifications
}
export default notificationService
