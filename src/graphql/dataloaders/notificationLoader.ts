import DataLoader from 'dataloader'

import { notificationService } from '../../services'
import { dataByQueryLoaderOptions as options, prime } from '../../utils'

const {
  getNotificationsByBatch,
  getNotifications,
  countNotifications
} = notificationService

const notificationLoader = () => new DataLoader(getNotifications)

type NotificationLoader = ReturnType<typeof notificationLoader>

const notificationByQueryLoader = (loader: NotificationLoader) => {
  return new DataLoader(async queries => {
    const res = await getNotificationsByBatch(queries as any)

    for (const page of res) {
      prime(loader, ...page.nodes)
    }

    return res
  }, options)
}

const notificationCountLoader = () => {
  return new DataLoader(countNotifications, options)
}

export {
  notificationLoader,
  notificationByQueryLoader,
  notificationCountLoader
}
