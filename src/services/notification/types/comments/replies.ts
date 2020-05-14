import { DataLoaders, i18n, locales, truncate } from '../../../../utils'
import { loadCommenters } from '../../actors'
import { NotificationInput } from '../../notificationServiceHelper'

const { notificationMessages } = locales
const {
  userRepliedToYourComment,
  usersRepliedToYourComment,
  userRepliedToCommentYouAreTaggedIn,
  usersRepliedToCommentYouAreTaggedIn
} = notificationMessages

const commentRepliesNotificationInfo = async (
  input: NotificationInput,
  loaders: DataLoaders
) => {
  const { data, recipient } = input
  const [commenters, targetComment] = await Promise.all([
    loadCommenters(input, loaders),
    loaders.commentLoader.load(data)
  ])

  const { actors, actorsCount: count } = commenters
  const user = actors[0].name
  const user2 = actors[1]?.name

  const comment = truncate(targetComment.content, 30)
  let text

  if (count === 1) {
    if (String(targetComment.author) === String(recipient)) {
      text = i18n.t(userRepliedToYourComment, { user, comment })
    } else {
      text = i18n.t(userRepliedToCommentYouAreTaggedIn, { user })
    }
  }

  if (count === 2) {
    if (String(targetComment.author) === String(recipient)) {
      text = i18n.t(usersRepliedToYourComment, { user1: user, user2, comment })
    } else {
      text = i18n.t(usersRepliedToCommentYouAreTaggedIn, { user1: user, user2 })
    }
  }

  if (count > 2) {
    if (String(targetComment.author) === String(recipient)) {
      text = i18n.t(usersRepliedToYourComment, { user, count: count - 1 })
    } else {
      text = i18n.t(usersRepliedToCommentYouAreTaggedIn, {
        user,
        count: count - 1
      })
    }
  }

  return { text, ...commenters }
}

export { commentRepliesNotificationInfo }
export default commentRepliesNotificationInfo
