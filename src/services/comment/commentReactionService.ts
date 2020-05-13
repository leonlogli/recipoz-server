import { DataLoaders, i18n, errorRes, locales } from '../../utils'
import { ModelService } from '../base'
import {
  CommentReaction,
  CommentReactionDocument,
  CommentReactionType
} from '../../models'
import { logger } from '../../config'
import { notificationService } from '../notification'

const { statusMessages } = locales
const { like, updated } = statusMessages.comment

export type ReactionInput = {
  account: string
  comment: string
  reaction: CommentReactionType
}

type Like = Omit<ReactionInput, 'reaction'>

const commentReactionModel = new ModelService<CommentReactionDocument>({
  model: CommentReaction
})

const countCommentReactions = commentReactionModel.countByBatch
const getCommentReactionsByBatch = commentReactionModel.batchFind

const addReaction = async (input: ReactionInput, loaders: DataLoaders) => {
  try {
    const { account, comment: commentId, reaction } = input
    const comment = await loaders.commentLoader.load(commentId)
    const set = { $set: { reaction, comment: commentId, account } }
    const query = { comment: commentId, account }

    await commentReactionModel.createOrUpdate(query, set)
    const recipient = comment.author

    notificationService.addNotification(
      { code: 'LIKES', data: commentId, dataType: 'Comment', recipient },
      loaders
    )

    return { success: 1, message: i18n.t(like), code: 201, comment }
  } catch (error) {
    return errorRes(error)
  }
}

const removeReaction = async (input: ReactionInput, loaders: DataLoaders) => {
  try {
    const { account, comment: commentId } = input

    await commentReactionModel.deleteOne({ comment: commentId, account })
    const message = i18n.t(updated)
    const comment = await loaders.commentLoader.load(commentId)

    return { success: 1, message, code: 200, comment }
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
