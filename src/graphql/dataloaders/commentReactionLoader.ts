import DataLoader from 'dataloader'

import { commentReactionService } from '../../services'
import { dataByQueryLoaderOptions as options } from '../../utils'

const {
  getCommentReactionsByBatch,
  countCommentReactions
} = commentReactionService

const commentReactionByQueryLoader = () => {
  return new DataLoader(getCommentReactionsByBatch, options)
}

const commentReactionCountLoader = () => {
  return new DataLoader(countCommentReactions, options)
}

export { commentReactionByQueryLoader, commentReactionCountLoader }
