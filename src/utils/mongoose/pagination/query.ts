import { DEFAULT_PAGE_SIZE } from '../../../config'
import { fromBase64 } from '../../base64'
import { CursorPagingQueryBase } from './paginate'
import { toObjectId } from '../docUtils'

/**
 * Decoded cursor object
 */
export type Cursor = {
  id: ReturnType<typeof toObjectId>
  /**
   * Value of the paginated field.
   */
  paginatedField?: string
}

export type CursorPagingQuery = Omit<
  CursorPagingQueryBase,
  'after' | 'before'
> &
  Required<Pick<CursorPagingQueryBase, 'paginatedField' | 'criteria'>> & {
    /**
     * The page size. Default to `DEFAULT_PAGE_SIZE`
     */
    limit: number
    /**
     * The (base64 decoded) object to start querying previous page query
     */
    after?: Cursor
    /**
     * The (base64 decoded) object value to start querying previous page
     */
    before?: Cursor
  }

const buildCursorParams = (opts?: CursorPagingQueryBase) => {
  const params: any = opts || {}

  if (opts?.before) {
    try {
      params.before = JSON.parse(fromBase64(opts.before))
      params.before.id = toObjectId(params.before.id)
    } catch (error) {
      throw Error('"before" contains an invalid value')
    }
  }

  if (opts?.after) {
    try {
      params.after = JSON.parse(fromBase64(opts.after))
      params.after.id = toObjectId(params.after.id)
    } catch (error) {
      throw Error('"after" contains an invalid value')
    }
  }

  params.limit = opts?.first || opts?.last || DEFAULT_PAGE_SIZE
  params.paginatedField = opts?.paginatedField || '_id'
  params.query = opts?.criteria || {}

  return params as CursorPagingQuery
}

const sortAscending = (opts: CursorPagingQuery) => {
  const { paginatedField, last, before } = opts
  const shouldSecondarySortOnId = paginatedField !== '_id'

  const sortDesc =
    (shouldSecondarySortOnId && paginatedField?.startsWith('-')) ||
    (!shouldSecondarySortOnId && (last || before))

  return !sortDesc
}

/**
 * Generates a `$sort` object given the parameters
 * @param opts The params originally passed to `find` or `aggregate`
 */
const buildSortDirectives = (opts: CursorPagingQuery) => {
  const { paginatedField } = opts
  const shouldSecondarySortOnId = paginatedField !== '_id'
  const sortDir = sortAscending(opts) ? 1 : -1

  if (shouldSecondarySortOnId) {
    return { [paginatedField]: sortDir, _id: sortDir }
  }

  return { [paginatedField]: sortDir }
}

/**
 * Generates a cursor query that provides the offset capabilities
 * @param opts The params originally passed to `find` or `aggregate`
 */
const buildCursorQuery = (opts: CursorPagingQuery) => {
  const { paginatedField, before, after } = opts

  if (!after && !before) {
    return {}
  }
  const shouldSecondarySortOnId = paginatedField !== '_id'
  const comparisonOp = sortAscending(opts) ? '$gt' : '$lt'

  // A `next` cursor will have precedence over a `previous` cursor.
  const cursor = (after || before) as Cursor

  if (shouldSecondarySortOnId) {
    return {
      $or: [
        { [paginatedField]: { [comparisonOp]: cursor.paginatedField } },
        {
          [paginatedField]: { $eq: cursor.paginatedField },
          _id: { [comparisonOp]: cursor.id }
        }
      ]
    }
  }

  return { [paginatedField]: { [comparisonOp]: cursor.id } }
}

export { buildCursorQuery, buildSortDirectives, buildCursorParams }
