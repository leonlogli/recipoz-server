import { AccountDocument } from '../../models'
import { DataLoaders, toGlobalId, getDataLoaderByModel } from '../../utils'
import { fcmService } from '../firebase'
import {
  canReceivePushNotification,
  NotificationInput
} from './notificationServiceHelper'
import {
  likeNotificationInfo,
  newRecipesNotificationInfo,
  commentNotificationInfo,
  newFollowersNotificationInfo,
  tagNotificationInfo
} from './types'

const sendNotification = async (
  input: NotificationInput,
  loaders: DataLoaders
) => {
  const { dataType, data: dataId, code, recipient: recipientId } = input
  const { accountLoader } = loaders

  const loader = getDataLoaderByModel(dataType, loaders)
  const [data, recipient] = await Promise.all([
    loader?.load(dataId) as any,
    accountLoader.load(recipientId) as Promise<AccountDocument>
  ])

  const dataGlobalId = toGlobalId(dataType, String(dataId))
  const paload = { data: { code, data: dataGlobalId } }
  const canReceivePushNotif = await canReceivePushNotification(input, loaders)

  if (!canReceivePushNotif) {
    return fcmService.sendMessageToUsers(paload, recipient)
  }

  switch (code) {
    case 'LIKES': {
      const { text: body, actors } = await likeNotificationInfo(input, loaders)
      const icon = actors[0].photo

      return fcmService.sendMessageToUsers({ ...paload, icon, body }, recipient)
    }
    case 'RECIPES': {
      const info = await newRecipesNotificationInfo(input, loaders)
      const { text: body, actor, recipesCount } = info
      const icon = actor.photo
      const image = { ...(recipesCount === 1 && { imageUrl: data.image }) }
      const msg = { ...paload, icon, body, ...image }

      return fcmService.sendMessageToUsers(msg, recipient)
    }
    case 'COMMENTS': {
      const info = await commentNotificationInfo(input, loaders)
      const { text: body, actors } = info
      const icon = actors[0].photo

      return fcmService.sendMessageToUsers({ ...paload, icon, body }, recipient)
    }
    case 'NEW_FOLLOWERS': {
      const info = await newFollowersNotificationInfo(input, loaders)
      const { text: body, actors } = info
      const icon = actors[0].photo

      return fcmService.sendMessageToUsers({ ...paload, icon, body }, recipient)
    }
    case 'TAGS': {
      const info = await tagNotificationInfo(input, loaders)
      const { text: body, actor } = info
      const icon = actor.photo

      return fcmService.sendMessageToUsers({ ...paload, icon, body }, recipient)
    }
    default:
      return null
  }
}

const loadNotificationInfo = async (
  input: NotificationInput,
  loaders: DataLoaders
) => {
  switch (input.code) {
    case 'LIKES': {
      return likeNotificationInfo(input, loaders)
    }
    case 'RECIPES': {
      return newRecipesNotificationInfo(input, loaders)
    }
    case 'COMMENTS': {
      return commentNotificationInfo(input, loaders)
    }
    case 'NEW_FOLLOWERS': {
      return newFollowersNotificationInfo(input, loaders)
    }
    case 'TAGS': {
      return tagNotificationInfo(input, loaders)
    }
    default:
      return null
  }
}

export { sendNotification, loadNotificationInfo }
