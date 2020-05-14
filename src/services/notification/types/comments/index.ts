import { DataLoaders } from '../../../../utils'
import { NotificationInput } from '../../notificationServiceHelper'
import commentRepliesNotificationInfo from './replies'
import recipeCommentNotificationInfo from './recipes'

export const commentNotificationInfo = async (
  input: NotificationInput,
  loaders: DataLoaders
) => {
  if (input.dataType === 'Recipe') {
    return recipeCommentNotificationInfo(input, loaders)
  }

  return commentRepliesNotificationInfo(input, loaders)
}

export default commentNotificationInfo
