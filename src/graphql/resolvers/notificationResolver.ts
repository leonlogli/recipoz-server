import { notificationService, loadNotificationInfo } from '../../services'
import { Context } from '..'
import { validateCursorQuery, validateNotification } from '../../validations'
import {
  buildFilterQuery,
  toLocalId,
  withClientMutationId,
  getDataLoaderByModel
} from '../../utils'

export default {
  Query: {
    myNotifications: (_: any, { filter, ...options }: any, ctx: Context) => {
      const filterQuery = buildFilterQuery(filter)
      const criteria = { recipient: ctx.accountId, ...filterQuery }
      const query = validateCursorQuery({ ...options, criteria })

      return ctx.dataLoaders.notificationByQueryLoader.load(query)
    }
  },
  Mutation: {
    updateNotification: (_: any, { input }: any, ctx: Context) => {
      const { accountId: recipient, dataLoaders: loaders } = ctx
      const { id } = toLocalId(input.id, 'Notification')

      const data = validateNotification({ ...input, id, recipient }, false)
      const payload = notificationService.updateNotification(data, loaders)

      return withClientMutationId(payload, input)
    },
    markAllNotificationsAsRead: (_: any, { input }: any, ctx: Context) => {
      const { markAllNotificationsAsRead } = notificationService
      const payload = markAllNotificationsAsRead(ctx.accountId)

      return withClientMutationId(payload, input)
    },
    deleteNotification: (_: any, { input }: any, { accountId }: Context) => {
      const { id } = toLocalId(input.id, 'Notification')

      const data = validateNotification({ id, recipient: accountId }, false)
      const payload = notificationService.deleteNotification(data)

      return withClientMutationId(payload, input)
    }
  },
  NotificationData: {
    __resolveType: (data: any) => data.__typename
  },
  NotificationActor: {
    __resolveType: (actor: any) => actor.__typename
  },
  Notification: {
    actors: async (notification: any, _: any, { dataLoaders }: Context) => {
      if (!notification.actors) {
        const res = await loadNotificationInfo(notification, dataLoaders)

        notification.actors = res?.actors
        notification.text = res?.text
      }

      return notification.actors.map((actor: any) => {
        const loader = getDataLoaderByModel(actor.__typename, dataLoaders)

        return loader?.load(actor.id)
      })
    },
    text: async (notification: any, _: any, { dataLoaders }: Context) => {
      if (!notification.text) {
        const res = await loadNotificationInfo(notification, dataLoaders)

        notification.actors = res?.actors
        notification.text = res?.text
      }

      return notification.text
    },
    recipient: async ({ recipient }: any, _: any, { dataLoaders }: Context) => {
      return dataLoaders.accountLoader.load(recipient)
    }
  },
  NotificationConnection: {
    totalCount: ({ totalCount, query }: any, _: any, ctx: Context) => {
      const { notificationCountLoader } = ctx.dataLoaders

      return totalCount || notificationCountLoader.load(query.criteria)
    }
  }
}
