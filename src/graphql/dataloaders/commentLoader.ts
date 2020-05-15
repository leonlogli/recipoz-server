import DataLoader from 'dataloader'

import { commentService } from '../../services'
import { dataByQueryLoaderOptions as options, prime } from '../../utils'

const { getCommentsByBatch, getComments, countComments } = commentService

const commentLoader = () => new DataLoader(getComments)

type CommentLoader = ReturnType<typeof commentLoader>

const commentByQueryLoader = (loader: CommentLoader) => {
  return new DataLoader(async queries => {
    const res = await getCommentsByBatch(queries as any)

    for (const page of res) {
      prime(loader, ...page.nodes)
    }

    return res
  }, options)
}

const commentCountLoader = () => {
  return new DataLoader(countComments, options)
}

export { commentLoader, commentByQueryLoader, commentCountLoader }
