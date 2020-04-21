import { Document } from 'mongoose'
import { dotify, toBase64 } from '../..'
import { Page, PageInfo } from './paginate'
import { Cursor, CursorPagingQuery } from './query'

/**
 * Build a base64 string cursor that will be sent to the client
 * @param opts: page info
 * @param doc: The cursor pointer doc.
 */
const buildCursor = (opts: CursorPagingQuery, doc: Document) => {
  const { paginatedField } = opts
  const shouldSecondarySortOnId = paginatedField !== '_id'

  const dotedDoc = dotify(JSON.parse(JSON.stringify(doc)))
  const cursor: Cursor = { id: dotedDoc._id }

  if (shouldSecondarySortOnId) {
    cursor.paginatedField = dotedDoc[paginatedField]
  }

  return toBase64(cursor)
}

/**
 * Parses the raw results from a find or aggregate query and generates a response object that
 * contain the various pagination properties
 * @param docs the results from a query
 * @param query The params originally passed to `find` or `aggregate`
 */
const buildPagedResponse = <T extends Document = Document>(
  results: T[],
  query: CursorPagingQuery
) => {
  let docs = results
  const hasMore = docs.length > query.limit

  // Remove the extra element that we added to 'peek' to see if there were more entries.
  if (hasMore) {
    docs.pop()
  }
  const hasPreviousPage = !!query.after || !!(query.before && hasMore)
  const hasNextPage = !!query.before || hasMore

  // If we sorted reverse to get the previous page, correct the sort order.
  if (query.before || query.last) {
    docs = docs.reverse()
  }
  const startCursor = docs.length > 0 && buildCursor(query, docs[0])
  const endCursor = startCursor && buildCursor(query, docs[docs.length - 1])

  const pageInfo: PageInfo = {
    hasPreviousPage,
    hasNextPage,
    ...(startCursor && { startCursor }),
    ...(endCursor && { endCursor })
  }

  const edges = docs.map(doc => ({
    node: doc,
    cursor: buildCursor(query, doc)
  }))
  const res: Page<T> = {
    edges,
    nodes: docs,
    pageInfo,
    query,
    ...(!hasNextPage && !hasPreviousPage && { totalCount: docs.length })
  }

  return res
}

export { buildPagedResponse }
export default buildPagedResponse
