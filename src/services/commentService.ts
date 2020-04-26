import { Comment, CommentDocument } from '../models'
import {
  i18n,
  DataLoaders,
  getDataLoaderByModel,
  errorRes,
  locales
} from '../utils'
import ModelService from './base/ModelService'
import { logger } from '../config'

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

const addComment = async (input: any, loaders: DataLoaders) => {
  try {
    const { topic, topicType, mentionedAccounts } = input
    const loader: any = getDataLoaderByModel(topicType, loaders)

    if (mentionedAccounts) {
      await Promise.all([
        loader.load(topic),
        loaders.accountLoader.loadMany(mentionedAccounts)
      ])
    } else await loader.load(topic)

    const comment = await commentModel.create(topic)
    const message = i18n.t(created)

    return { success: true, message, code: 201, comment }
  } catch (error) {
    return errorRes(error)
  }
}

const suitableErrorResponse = async (commentId: any) => {
  const exists = await commentModel.exists(commentId)
  const message = i18n.t(exists ? errorMessages.forbidden : notFound)

  return { success: false, message, code: exists ? 403 : 404 }
}

const updateComment = async (input: any, loaders: DataLoaders) => {
  try {
    const { id: _id, author, mentionedAccounts, ...data } = input

    if (mentionedAccounts) {
      await loaders.accountLoader.loadMany(mentionedAccounts)
    }
    const set = { $set: { ...data, mentionedAccounts } }
    const comment = await commentModel.updateOne({ _id, author }, set, loaders)

    if (!comment) {
      return suitableErrorResponse(_id)
    }

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

const loadCommentRatingSummary = (criteria: any, dataLoaders: DataLoaders) => {
  return dataLoaders.commentCountLoader
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
