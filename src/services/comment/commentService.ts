import { Comment, CommentDocument, RecipeDocument } from '../../models'
import {
  i18n,
  DataLoaders,
  getDataLoaderByModel,
  errorRes,
  locales
} from '../../utils'
import { ModelService } from '../base'
import { logger } from '../../config'
import { notificationService } from '../notification'
import {
  updateCommentNotification,
  loadCommentRatingSummary,
  CommentInput,
  addCommentNotifications
} from './commentServiceHelper'

const { statusMessages, errorMessages } = locales
const { notFound } = errorMessages.comment
const { created, deleted, updated } = statusMessages.comment

const commentModel = new ModelService<CommentDocument>({
  model: Comment,
  onNotFound: notFound
})

const countComments = commentModel.countByBatch
const getComments = commentModel.findByIds
const getCommentsByBatch = commentModel.batchFind
const getCommentAndSelect = commentModel.findOne

const addComment = async (input: CommentInput, loaders: DataLoaders) => {
  try {
    const { topic, topicType, taggedAccounts: tagged } = input
    const loader: any = getDataLoaderByModel(topicType, loaders)

    const [topicDoc] = await Promise.all([
      loader.load(topic) as Promise<CommentDocument | RecipeDocument>,
      tagged && loaders.accountLoader.loadMany(tagged as any)
    ])
    const comment = await commentModel.create(input)

    addCommentNotifications(comment, topicDoc, loaders)

    return { success: true, message: i18n.t(created), code: 201, comment }
  } catch (error) {
    return errorRes(error)
  }
}

const suitableErrorResponse = async (commentId: any) => {
  const exists = await commentModel.exists(commentId)
  const message = i18n.t(exists ? errorMessages.forbidden : notFound)

  return { success: false, message, code: exists ? 403 : 404 }
}

const updateComment = async (input: CommentInput, loaders: DataLoaders) => {
  try {
    const { id: _id, author, taggedAccounts, ...data } = input
    let oldComment

    if (taggedAccounts) {
      const [, _oldComment] = await Promise.all([
        loaders.accountLoader.loadMany(taggedAccounts),
        Comment.findById(_id, 'taggedAccounts', { lean: true }).exec()
      ])

      oldComment = _oldComment
    }
    const set = { $set: { ...data, taggedAccounts } }
    const comment = await commentModel.updateOne({ _id, author }, set, loaders)

    if (!comment) {
      return suitableErrorResponse(_id)
    }
    updateCommentNotification(loaders, comment, oldComment as any)

    return { success: true, message: i18n.t(updated), code: 200, comment }
  } catch (error) {
    return errorRes(error)
  }
}

const deleteComment = async (input: any) => {
  try {
    const { id: _id, author } = input
    const comment = await commentModel.deleteOne({ _id, author })

    if (!comment) {
      return suitableErrorResponse(_id)
    }
    notificationService.deleteNotifications({ data: _id, dataType: 'Comment' })

    return { success: true, message: i18n.t(deleted), code: 200, comment }
  } catch (error) {
    return errorRes(error)
  }
}

const deleteComments = async (accountId: string) => {
  return Comment.deleteMany({ author: accountId } as any)
    .exec()
    .catch(e =>
      logger.error(`Error deleting account (${accountId}) comments: `, e)
    )
}

export const commentService = {
  getComments,
  countComments,
  getCommentsByBatch,
  getCommentAndSelect,
  addComment,
  deleteComment,
  updateComment,
  deleteComments,
  loadCommentRatingSummary
}
export default commentService
