import { DataLoaders, i18n, locales } from '../../../utils'
import { loadFollowers } from '../actors'
import { NotificationInput } from '../notificationServiceHelper'

const { notificationMessages } = locales
const { userFollowsYou, usersFollowYou } = notificationMessages
const { t } = i18n

const newFollowersNotificationInfo = async (
  input: NotificationInput,
  loaders: DataLoaders
) => {
  const followers = await loadFollowers(input, loaders)

  const { actors, actorsCount: count } = followers
  const user = actors[0].name
  const user2 = actors[1]?.name
  let text

  if (count === 1) {
    text = t(userFollowsYou, { user })
  }

  if (count === 2) {
    text = t(usersFollowYou, { user1: user, user2 })
  }

  if (count > 2) {
    text = t(usersFollowYou, { user, count: count - 1 })
  }

  return { text, ...followers }
}

export { newFollowersNotificationInfo }
export default newFollowersNotificationInfo
