import {
  NotificationDocument,
  AccountDocument,
  RecipeSourceDocument
} from '../../models'
import { objectIdFromDate, objectIdToDate, DataLoaders } from '../../utils'
import {
  DAILY_MAX_PUSH_NOTIFICATION,
  MAX_APP_NOTIFICATION_PAR_ACCOUNT
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

  const limit = MAX_APP_NOTIFICATION_PAR_ACCOUNT
  const query = { criteria, limit, paginatedField: '_id' }

  const [{ nodes: lastNotifications }, recipient] = await Promise.all([
    loaders.notificationByQueryLoader.load(query),
    loaders.accountLoader.load(recipientId)
  ])

  const isAlreadyNotified = lastNotifications.find(n => n.code === code)
  const hasReachedDailyFrequency =
    lastNotifications.length > DAILY_MAX_PUSH_NOTIFICATION

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
  return Promise.all(
    actors.map(async (actor: any) => {
      if (actor.logo) {
        const { logo: photo, name, _id: id } = actor

        return { id, photo, name, __typename: 'RecipeSource' } as Actor
      }
      const user = await loaders.userLoader.load(actor.user)
      const { photoURL: photo, displayName, email } = user || {}
      const name = displayName || email?.substring(0, email.indexOf('@'))

      return { id: actor._id, photo, name, __typename: 'Account' } as Actor
    })
  )
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
  const id = lastReadNotification.nodes[0]?._id || 0

  return objectIdFromDate(objectIdToDate(id))
}

export {
  canReceivePushNotification,
  lastReadNotificationId,
  buildNotificationActors
}
