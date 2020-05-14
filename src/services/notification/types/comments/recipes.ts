import { DataLoaders, i18n, locales, truncate } from '../../../../utils'
import { loadCommenters } from '../../actors'
import { NotificationInput } from '../../notificationServiceHelper'

const { notificationMessages } = locales
const {
  authorCommentsHisRecipe,
  userCommentsRecipe,
  userCommentsYourRecipe,
  usersCommentRecipe,
  usersCommentYourRecipe
} = notificationMessages

const recipeCommentNotificationInfo = async (
  input: NotificationInput,
  loaders: DataLoaders
) => {
  const { data, recipient } = input
  const [commenters, targetRecipe] = await Promise.all([
    loadCommenters(input, loaders),
    loaders.recipeLoader.load(data)
  ])

  const { actors, actorsCount: count } = commenters
  const user = actors[0].name
  const user2 = actors[1]?.name

  const recipe = truncate(targetRecipe.name, 30)
  let text

  if (count === 1) {
    if (String(actors[0].id) === String(targetRecipe.author)) {
      text = i18n.t(authorCommentsHisRecipe, { author: user })
    } else if (String(targetRecipe.author) === String(recipient)) {
      text = i18n.t(userCommentsYourRecipe, { user })
    } else {
      text = i18n.t(userCommentsRecipe, { user, recipe })
    }
  }

  if (count === 2) {
    if (String(targetRecipe.author) === String(recipient)) {
      text = i18n.t(usersCommentYourRecipe, { user1: user, user2 })
    } else {
      text = i18n.t(usersCommentRecipe, { user1: user, user2, recipe })
    }
  }

  if (count > 2) {
    if (String(targetRecipe.author) === String(recipient)) {
      text = i18n.t(usersCommentYourRecipe, { user, count: count - 1 })
    } else {
      text = i18n.t(usersCommentRecipe, { user, recipe, count: count - 1 })
    }
  }

  return { text, ...commenters }
}

export { recipeCommentNotificationInfo }
export default recipeCommentNotificationInfo
