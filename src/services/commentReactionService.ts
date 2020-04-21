import { statusMessages } from '../constants'
import { DataLoaders, i18n, errorRes } from '../utils'
import { ModelService } from './base'
import {
  CommentReaction,
  CommentReactionDocument,
  CommentReactionType
} from '../models'
import { logger } from '../config'

const { like, updated } = statusMessages.comment

const commentReactionModel = new ModelService<CommentReactionDocument>({
  model: CommentReaction
})

const countCommentReactions = commentReactionModel.countByBatch
const getCommentReactionsByBatch = commentReactionModel.batchFind

export type ReactionInput = {
  account: string
  comment: string
  reaction: CommentReactionType
}

type Like = Omit<ReactionInput, 'reaction'>

const addReaction = async (opts: ReactionInput, loaders: DataLoaders) => {
  try {
    const { account, comment, reaction } = opts
    const commentDoc = await loaders.commentLoader.load(comment)
    const set = { $set: { reaction, comment, account } }

    await commentReactionModel.createOrUpdate({ comment, account }, set)

    return { success: 1, message: i18n.t(like), code: 201, comment: commentDoc }
  } catch (error) {
    return errorRes(error)
  }
}

const removeReaction = async (opts: ReactionInput, loaders: DataLoaders) => {
  try {
    const { account, comment } = opts

    await commentReactionModel.deleteOne({ comment, account })
    const message = i18n.t(updated)
    const commentDoc = loaders.commentLoader.load(comment)

    return { success: 1, message, code: 200, comment: commentDoc }
  } catch (error) {
    return errorRes(error)
  }
}

const likeComment = (data: Like, loaders: DataLoaders) => {
  return addReaction({ ...data, reaction: 'LIKE' }, loaders)
}

const unlikeComment = (data: Like, loaders: DataLoaders) => {
  return removeReaction({ ...data, reaction: 'LIKE' }, loaders)
}

const deleteCommentReactions = async (accountId: string) => {
  return CommentReaction.deleteMany({ account: accountId } as any)
    .exec()
    .then(res => res)
    .catch(error => logger.error('Error deleting comment reactions: ', error))
}

export const commentReactionService = {
  addReaction,
  removeReaction,
  getCommentReactionsByBatch,
  countCommentReactions,
  deleteCommentReactions,
  likeComment,
  unlikeComment
}
export default commentReactionService
