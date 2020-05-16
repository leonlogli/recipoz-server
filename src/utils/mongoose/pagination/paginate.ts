import { Document, Model } from 'mongoose'
import { isEmpty } from '../../Util'
import {
  buildCursorParams,
  buildCursorQuery,
  buildSortDirectives,
  CursorPagingQuery
} from './query'
import buildPagedResponse from './result'

export type CursorPagingQueryBase = {
  /** The find query criteria */
  criteria?: Record<string, any>
  first?: number
  last?: number
  /**
   * The field name to query the range for. The field must be:
   *        1. Orderable. We must sort by this value. If duplicate values for paginatedField field
   *          exist, the results will be secondarily ordered by the _id.
   *        2. Indexed. For large collections, this should be indexed for query performance.
   *        3. Immutable. If the value changes between paged queries, it could appear twice.
   * The default is to use the Mongo built-in '_id' field, which satisfies the above criteria.
   * The only reason to NOT use the Mongo _id field is if you chose to implement your own ids.
   */
  paginatedField?: string
  /** The (base64 encoded) value to start querying the page. */
  after?: string
  /** The (base64 encoded) value to start querying previous page */
  before?: string
}

export type Edge<T extends Document = Document> = {
  /** The cursor pointer to this edge's node */
  cursor: string
  node: T
}

export type PageInfo = {
  /**
   * Indicates whether next data exist
   */
  hasNextPage: boolean
  /**
   * Indicates whether previous data exist
   */
  hasPreviousPage: boolean
  /**
   * The value to start querying previous page. The cursor of the first edge
   */
  startCursor?: string
  /**
   * The value to start querying the page. The cursor of the last edge
   */
  endCursor?: string
}

export type Page<T extends Document = Document> = {
  edges: Edge<T>[]
  /**
   * For a finite list of doc, and clients that don’t need edge cursors for pagination
   */
  nodes: T[]
  pageInfo: PageInfo
  /**
   * The query that is passed to get this response
   */
  query: CursorPagingQuery
  /**
   * Total item that math the query criteria. It is not required since it can be depend
   *  on another collection (case of many to many relationship)
   */
  totalCount?: number
}

/**
 * Performs a find() query on the given model using specified criteria . The results are ordered by the paginatedField.
 */
const paginate = async (
  model: Model<Document>,
  opts?: CursorPagingQueryBase
) => {
  const params = buildCursorParams(opts)
  const cursorQuery = buildCursorQuery(params)
  const $sort = buildSortDirectives(params)

  const query: any = isEmpty(params.criteria)
    ? cursorQuery
    : { $and: [cursorQuery, params.criteria] }

  const results = await model
    .find(query)
    .sort($sort)
    .limit(params.limit + 1) // Query one more element to see if there's another page.
    .exec()

  return buildPagedResponse(results, params)
}

export { paginate }
export default paginate
