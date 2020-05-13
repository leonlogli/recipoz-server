import { notificationService } from '../../services'
import { Context } from '..'
import { validateCursorQuery } from '../../validations'
import { buildFilterQuery, toLocalId, withClientMutationId } from '../../utils'
import { validateNotification } from '../../validations/notification.validation'

export default {
  Query: {
    myNotifications: (_: any, { filter, ...options }: any, ctx: Context) => {
      const filterQuery = buildFilterQuery(filter)
      const criteria = { recipient: ctx.accountId, ...filterQuery }
      const cursorQuery = validateCursorQuery(options)
      const { notificationByQueryLoader } = ctx.dataLoaders

      return notificationByQueryLoader.load({ ...cursorQuery, criteria })
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
  Notification: {
    actor: async ({ actor }: any, _: any, { dataLoaders }: Context) => {
      return dataLoaders.accountLoader.load(actor)
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
