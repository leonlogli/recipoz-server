import {
  NotificationDocument,
  AccountDocument,
  RecipeSourceDocument
} from '../../models'
import { objectIdFromDate, objectIdToDate, DataLoaders } from '../../utils'
import {
  DAILY_MAX_PUSH_NOTIFICATION,
  MAX_APP_NOTIFICATION_PAR_ACCOUNT as MAX_NOTIFICATION
} from '../../config'
import { validateCursorQuery } from '../../validations'

export type NotificationInput = Pick<
  NotificationDocument,
  'dataType' | 'read' | 'code'
> & {
  recipient: string
  data: string
}

export type Actor = { id: string; photo: string; name: string }

export type ActorsInfo = { actors: Actor[]; actorsCount: number }

const canReceivePushNotification = async (
  input: NotificationInput,
  loaders: DataLoaders
) => {
  const { recipient: recipientId, code } = input
  const lastMidnightId = objectIdFromDate(new Date().setUTCHours(0, 0, 0, 0))

  const criteria = { _id: { $gt: lastMidnightId }, recipient: recipientId }
  const query = { criteria, limit: MAX_NOTIFICATION, paginatedField: '_id' }
  const { notificationByQueryLoader: loader } = loaders

  const { nodes: lastNotifications } = await loader.load(query)
  const isAlreadyNotified = lastNotifications.find(n => n.code === code)
  const hasReachedDailyFrequency =
    lastNotifications.length > DAILY_MAX_PUSH_NOTIFICATION

  const recipient = await loaders.accountLoader.load(recipientId)

  return (
    recipient.notificationSettings.push.includes(code) &&
    !hasReachedDailyFrequency &&
    !isAlreadyNotified &&
    !!recipient.registrationTokens.length
  )
}

const buildNotificationActors = async (
  loaders: DataLoaders,
  ...actors: (AccountDocument | RecipeSourceDocument)[]
): Promise<Actor[]> => {
  return actors.map(async (actor: any) => {
    if (actor.logo) {
      return { id: actor._id, photo: actor.logo, name: actor.name } as Actor
    }
    const user = await loaders.userLoader.load(actor.user)
    const { photoURL: photo, displayName: name } = user || {}

    return { id: actor._id, photo, name } as Actor
  }) as any[]
}

const lastReadNotificationId = async (
  input: NotificationInput,
  loaders: DataLoaders
) => {
  const { dataType, data, code, recipient } = input as any

  const criteria = { recipient, data, dataType, code, read: true }
  const query = validateCursorQuery({ first: 1, criteria })
  const { notificationByQueryLoader } = loaders

  const lastReadNotification = await notificationByQueryLoader.load(query)
  const id = lastReadNotification.nodes[0]._id || 0

  return objectIdFromDate(objectIdToDate(id))
}

export {
  canReceivePushNotification,
  lastReadNotificationId,
  buildNotificationActors
}
