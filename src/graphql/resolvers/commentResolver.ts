import { commentService, commentReactionService } from '../../services'
import { Context } from '../context'
import {
  validateComment,
  validateCursorQuery,
  validateCommentReaction
} from '../../validations'
import {
  loadAccountsFromReactions,
  emptyConnection,
  toLocalId,
  withClientMutationId,
  toLocalIds
} from '../../utils'
import { commentTopics } from '../../models'

export default {
  Query: {
    comments: (_: any, { topic, ...options }: any, ctx: Context) => {
      const { type, id } = toLocalId(topic, ...commentTopics)

      if (!type || !id) {
        return emptyConnection()
      }
      const criteria = { topic: id, topicType: type }
      const cursorQuery = validateCursorQuery(options)
      const { commentByQueryLoader } = ctx.dataLoaders

      return commentByQueryLoader.load({ ...cursorQuery, criteria })
    }
  },
  Mutation: {
    addComment: (_: any, { input }: any, ctx: Context) => {
      const { topic, mentionedAccounts: mentioned, ...props } = input
      const { type, id } = toLocalId(topic, ...commentTopics)
      const { accountId: author, dataLoaders } = ctx
      const mentionedAccounts = mentioned && toLocalIds(mentioned, 'Account')

      const value = { topicType: type, topic: id, mentionedAccounts, author }
      const comment = validateComment({ ...props, ...value })
      const payload = commentService.addComment(comment, dataLoaders)

      return withClientMutationId(payload, input)
    },
    updateComment: (_: any, { input }: any, ctx: Context) => {
      const { mentionedAccounts: mentioned, ...props } = input
      const { id } = toLocalId(input.id, 'Comment')
      const { accountId: author, dataLoaders } = ctx
      const mentionedAccounts = mentioned && toLocalIds(mentioned, 'Account')

      const data = validateComment({ ...props, id, mentionedAccounts, author })
      const payload = commentService.updateComment(data, dataLoaders)

      return withClientMutationId(payload, input)
    },
    deleteComment: (_: any, { input }: any, { accountId }: Context) => {
      const { id } = toLocalId(input.id, 'Comment')

      const comment = validateComment({ id, author: accountId }, false)
      const payload = commentService.deleteComment(comment)

      return withClientMutationId(payload, input)
    },
    like: (_: any, { input }: any, ctx: Context) => {
      const { accountId: account, dataLoaders: loaders } = ctx
      const { id: comment } = toLocalId(input.comment, 'Comment')

      const data = validateCommentReaction({ account, comment })
      const payload = commentReactionService.likeComment(data, loaders)

      return withClientMutationId(payload, input)
    },
    unlike: (_: any, { input }: any, ctx: Context) => {
      const { accountId, dataLoaders: loaders } = ctx
      const { id: comment } = toLocalId(input.comment, 'Comment')

      const data = validateCommentReaction({ account: accountId, comment })
      const payload = commentReactionService.unlikeComment(data, loaders)

      return withClientMutationId(payload, input)
    }
  },
  CommentOrderBy: {
    DATE_ASC: 'createdAt',
    DATE_DESC: '-createdAt',
    RATING_ASC: 'rating',
    RATING_DESC: '-rating'
  },
  CommentRating: {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5
  },
  CommentTopic: {
    __resolveType: (data: any) => data.__typename
  },
  Comment: {
    author: ({ author }: any, _: any, ctx: Context) => {
      return ctx.dataLoaders.accountLoader.load(author)
    },
    replies: ({ _id }: any, args: any, { dataLoaders: loaders }: Context) => {
      const criteria = { topic: _id, topicType: 'Recipe' }
      const cursorQuery = validateCursorQuery(args)

      return loaders.commentByQueryLoader.load({ ...cursorQuery, criteria })
    },
    mentionedAccounts: ({ mentionedAccounts }: any, _: any, ctx: Context) => {
      return ctx.dataLoaders.accountLoader.loadMany(mentionedAccounts)
    },
    likedBy: async ({ _id }: any, args: any, { dataLoaders }: Context) => {
      const opts = validateCursorQuery(args)
      const criteria = { comment: _id, reaction: 'LIKE' }
      const { commentReactionByQueryLoader: loader } = dataLoaders

      return loader.load({ ...opts, criteria }).then(reactions => {
        return loadAccountsFromReactions(reactions, dataLoaders)
      })
    }
  },
  CommentConnection: {
    totalCount: ({ totalCount, query }: any, _: any, ctx: Context) => {
      const { commentCountLoader } = ctx.dataLoaders

      return totalCount || commentCountLoader.load(query.criteria)
    }
  }
}
