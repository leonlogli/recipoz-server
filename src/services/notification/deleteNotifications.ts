import { logger, MAX_APP_NOTIFICATION_PAR_ACCOUNT } from '../../config'
import { Notification } from '../../models'
import { clean, isEmpty } from '../../utils'
import { NotificationInput } from './notificationServiceHelper'

const deleteOldNotifications = async (recipient: any) => {
  if (!MAX_APP_NOTIFICATION_PAR_ACCOUNT) {
    return
  }
  const opts = { lean: true, skip: MAX_APP_NOTIFICATION_PAR_ACCOUNT }
  const docs = await Notification.find({ recipient }, '_id', opts).exec()

  if (docs.length > 0) {
    await Notification.deleteMany({ _id: { $in: docs } }).exec()
  }
}

const deleteNotifications = async (query: Partial<NotificationInput>) => {
  const { recipient, data, dataType, code } = query
  const criteria: any = clean({ recipient, data, dataType, code })

  if (isEmpty(criteria)) {
    return
  }

  return Notification.deleteMany(criteria)
    .exec()
    .catch(e =>
      logger.error(`Error deleting notifications (query: ${criteria}): `, e)
    )
}

export { deleteOldNotifications, deleteNotifications }
