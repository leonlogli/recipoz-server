import { firebaseAdmin, PUSH_NOTIFICATION_WEB_ACTION_LINK } from '../../config'
import { clean } from '../../utils'

export type Message = firebaseAdmin.messaging.Message
export type MulticastMessage = firebaseAdmin.messaging.MulticastMessage

type Recipient = 'token' | 'topic' | 'condition'

/**
 * Cross-platform notification message
 */
export type Notification = firebaseAdmin.messaging.Notification & {
  /**
   * Arbitrary data that you want associated with the notification.
   */
  data?: Record<string, string>
  /**
   * The link to open when the user clicks on the notification
   * **Platforms:** Web
   */
  link?: string
  /**
   * URL to the notification icon.
   * **Platforms:** Android, Web
   */
  icon?: string
  /**
   * Action associated with a user click on the notification
   * **Platforms:** Android
   */
  clickAction?: string
  /**
   * Badge to be displayed with the message
   * **Platforms:** iOS, Android
   */
  badge?: number
  /**
   * Type of the notification.
   * **Platforms:** iOS
   */
  category?: string
} & { [key in Recipient]?: string }

const chooseRecipient = (msg: Notification) => {
  if (msg.token && msg.token.trim()) {
    return { token: msg.token }
  }
  if (msg.topic && msg.topic.trim()) {
    return { topic: msg.topic }
  }
  if (msg.condition && msg.condition.trim()) {
    return { condition: msg.condition }
  }
}

/**
 * Build cross-platform notification message
 */
const buildCrossPlatformMessage = (msg: Notification) => {
  const { title, body, imageUrl, icon, badge, category } = msg
  const dataAndRecipient = { ...chooseRecipient(msg), data: msg.data }

  const res = clean(
    {
      ...dataAndRecipient,
      notification: { title, body, imageUrl },
      android: {
        notification: {
          icon,
          notificationCount: msg.badge,
          clickAction: msg.clickAction
        }
      },
      webpush: {
        notification: { icon },
        fcmOptions: {
          link: msg.link || PUSH_NOTIFICATION_WEB_ACTION_LINK
        }
      },
      apns: {
        payload: {
          aps: { badge, category }
        }
      }
    },
    true
  )

  return title || body || imageUrl ? res : dataAndRecipient
}

const messaging = firebaseAdmin.messaging()

const isValidFCMToken = async (registrationToken: string) => {
  return messaging
    .send({ token: registrationToken }, true)
    .then(() => true)
    .catch(() => false)
}

export { buildCrossPlatformMessage, isValidFCMToken, messaging }
