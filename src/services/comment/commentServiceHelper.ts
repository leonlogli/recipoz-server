import { DataLoaders } from '../../utils'
import { CommentDocument, RecipeDocument } from '../../models'
import { notificationService } from '../notification'

const {
  addNotification,
  addNotifications,
  deleteNotifications
} = notificationService

export type CommentInput = CommentDocument & {
  topic: string
  taggedAccounts: string[]
}

const loadCommentRatingSummary = async (
  criteria: Pick<CommentInput, 'topic' | 'topicType'>,
  loaders: DataLoaders
) => {
  return loaders.commentCountLoader
    .loadMany([
      { ...criteria, rating: { $exists: true } },
      { ...criteria, rating: 1 },
      { ...criteria, rating: 2 },
      { ...criteria, rating: 3 },
      { ...criteria, rating: 4 },
      { ...criteria, rating: 5 }
    ])
    .then(res => {
      const [totalCount, one, two, three, four, five] = res as number[]
      const average =
        1 * one + 2 * two + 3 * three + 4 * three + 3 * four + 2 * five

      return { totalCount, one, two, three, four, five, average }
    })
}

const addCommentNotifications = async (
  comment: CommentDocument,
  topic: RecipeDocument | CommentDocument,
  loaders: DataLoaders
) => {
  const topicType = (topic as RecipeDocument).ingredients ? 'Recipe' : 'Comment'
  const recipient = topic.author as any
  const taggedAccounts = [...(comment.taggedAccounts || [])]

  return Promise.all([
    addNotification(
      { code: 'COMMENTS', data: topic._id, dataType: topicType, recipient },
      loaders
    ),
    addNotifications(
      { code: 'TAGS', data: comment._id, dataType: 'Comment' },
      taggedAccounts,
      loaders
    )
  ])
}

const updateCommentNotification = async (
  loaders: DataLoaders,
  newComment: CommentDocument,
  oldComment?: CommentDocument
) => {
  const { _id, taggedAccounts } = newComment
  const qery = { code: 'TAGS', data: _id, dataType: 'Comment' } as const

  if (oldComment && oldComment.taggedAccounts.length) {
    const recipient: any = { $in: oldComment.taggedAccounts }

    return deleteNotifications({ ...qery, recipient }).then(() =>
      addNotifications(qery, [...(taggedAccounts || [])], loaders)
    )
  }

  return addNotifications(qery, [...(taggedAccounts || [])], loaders)
}

export {
  loadCommentRatingSummary,
  updateCommentNotification,
  addCommentNotifications
}
