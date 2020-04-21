import DataLoader from 'dataloader'

import { commentService } from '../../services'
import { dataByQueryLoaderOptions as options } from '../../utils'

const { getCommentsByBatch, getComments, countComments } = commentService

const commentLoader = () => new DataLoader(getComments)

const commentByQueryLoader = () => {
  return new DataLoader(getCommentsByBatch, options)
}

const commentCountLoader = () => {
  return new DataLoader(countComments, options)
}

export { commentLoader, commentByQueryLoader, commentCountLoader }
