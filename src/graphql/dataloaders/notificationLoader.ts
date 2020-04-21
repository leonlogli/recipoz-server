import DataLoader from 'dataloader'

import { notificationService } from '../../services'
import { dataByQueryLoaderOptions as options } from '../../utils'

const {
  getNotificationsByBatch,
  getNotifications,
  countNotifications
} = notificationService

const notificationLoader = () => new DataLoader(getNotifications)

const notificationByQueryLoader = () => {
  return new DataLoader(getNotificationsByBatch, options)
}

const notificationCountLoader = () => {
  return new DataLoader(countNotifications, options)
}

export {
  notificationLoader,
  notificationByQueryLoader,
  notificationCountLoader
}
