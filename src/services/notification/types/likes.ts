import { DataLoaders, i18n, locales, truncate } from '../../../utils'
import { loadCommentLikers } from '../actors'
import { NotificationInput } from '../notificationServiceHelper'

const { notificationMessages } = locales
const { userLikesYourComment, usersLikeYourComment } = notificationMessages

const likeNotificationInfo = async (
  input: NotificationInput,
  loaders: DataLoaders
) => {
  const [likers, targetComment] = await Promise.all([
    loadCommentLikers(input, loaders),
    loaders.commentLoader.load(input.data)
  ])

  const { actors, actorsCount: count } = likers
  const user = actors[0].name
  const user2 = actors[1]?.name

  let text
  const comment = truncate(targetComment.content, 30)

  if (count === 1) {
    text = i18n.t(userLikesYourComment, { user, comment })
  }

  if (count === 2) {
    text = i18n.t(usersLikeYourComment, { user1: user, user2, comment })
  }

  if (count > 2) {
    text = i18n.t(userLikesYourComment, { user, count: count - 1 })
  }

  return { text, ...likers }
}

export { likeNotificationInfo }
export default likeNotificationInfo
