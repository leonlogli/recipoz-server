import {
  DataLoaders,
  loadAccountsFromReactions,
  loadFollowersFromFollowerships
} from '../../utils'
import {
  buildNotificationActors,
  lastReadNotificationId,
  NotificationInput,
  ActorsInfo
} from './notificationServiceHelper'
import { validateCursorQuery } from '../../validations'

const loadCommentLikers = async (
  input: NotificationInput,
  loaders: DataLoaders
) => {
  const { recipient: comment } = input
  const { commentReactionByQueryLoader, commentReactionCountLoader } = loaders

  const id = await lastReadNotificationId(input, loaders)
  const criteria = { _id: { $gt: id }, comment }

  const query = validateCursorQuery({ first: 2, criteria })
  const reactions = await commentReactionByQueryLoader.load(query)
  const accounts = loadAccountsFromReactions(reactions, loaders).nodes

  const actors = buildNotificationActors(loaders, ...accounts)
  const actorsCount =
    reactions.totalCount || commentReactionCountLoader.load(criteria)
  const actorsInfo: ActorsInfo = { actors, actorsCount } as any

  return actorsInfo
}

const loadCommenters = async (
  input: NotificationInput,
  loaders: DataLoaders
) => {
  const id = await lastReadNotificationId(input, loaders)
  const { recipient: data, dataType } = input
  const { commentByQueryLoader, accountLoader, commentCountLoader } = loaders
  const criteria = { _id: { $gt: id }, topic: data, topicType: dataType }

  const query = validateCursorQuery({ first: 2, criteria })
  const comments = await commentByQueryLoader.load(query)

  const authors = comments.nodes.map(comment => comment.author)
  const accounts = await accountLoader.loadMany(authors as any)

  const actors = buildNotificationActors(loaders, ...(accounts as any))
  const actorsCount = comments.totalCount || commentCountLoader.load(criteria)
  const actorsInfo: ActorsInfo = { actors, actorsCount } as any

  return actorsInfo
}

const loadNewRecipes = async (
  input: NotificationInput,
  loaders: DataLoaders
) => {
  const id = await lastReadNotificationId(input, loaders)
  const { recipient: data } = input
  const { recipeByQueryLoader, accountLoader, recipeCountLoader } = loaders
  const { author, source } = await loaders.recipeLoader.load(data)

  const sourceCriteria = { ...(source && { source }) }
  const authorCriteria = { ...(author && { author }) }
  const criteria = { _id: { $gt: id }, ...authorCriteria, ...sourceCriteria }

  const query = validateCursorQuery({ first: 2, criteria })
  const recipes = await recipeByQueryLoader.load(query)

  const owner = source
    ? await loaders.recipeSourceLoader.load(source)
    : await accountLoader.load(author)
  const actors = await buildNotificationActors(loaders, ...(owner as any))
  const recipesCount = recipes.totalCount || recipeCountLoader.load(criteria)

  return { actor: actors[0], recipesCount }
}

const loadFollowers = async (
  input: NotificationInput,
  loaders: DataLoaders
) => {
  const { followershipByQueryLoader, followershipCountLoader } = loaders

  const id = await lastReadNotificationId(input, loaders)
  const followedData = input.recipient
  const followedDataType = 'Account'
  const criteria = { _id: { $gt: id }, followedData, followedDataType }

  const query = validateCursorQuery({ first: 2, criteria })
  const followership = await followershipByQueryLoader.load(query)

  const accounts = await Promise.all(
    loadFollowersFromFollowerships(followership, loaders).nodes
  )
  const actors = await buildNotificationActors(loaders, ...accounts)

  const actorsCount =
    followership.totalCount || (await followershipCountLoader.load(criteria))
  const actorsInfo: ActorsInfo = { actors, actorsCount }

  return actorsInfo
}

const loadTagActor = async (input: NotificationInput, loaders: DataLoaders) => {
  const targetComment = await loaders.commentLoader.load(input.recipient)
  const account = await loaders.accountLoader.load(targetComment.author)

  const actors = await buildNotificationActors(loaders, account as any)

  return actors[0]
}

export {
  loadCommentLikers,
  loadCommenters,
  loadNewRecipes,
  loadFollowers,
  loadTagActor
}
