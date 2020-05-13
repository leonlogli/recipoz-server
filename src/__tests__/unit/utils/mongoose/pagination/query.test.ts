import { expect } from 'chai'

import {
  buildCursorParams,
  buildSortDirectives,
  buildCursorQuery
} from '../../../../../utils/mongoose/pagination/query'
import { DEFAULT_PAGE_SIZE } from '../../../../../config'
import { toObjectId } from '../../../../../utils'

describe('Cursor pagination', () => {
  it('should build cursor params for empty options', () => {
    const expected = {
      limit: DEFAULT_PAGE_SIZE,
      paginatedField: '_id',
      criteria: {}
    }

    expect(buildCursorParams({})).to.eql(expected)
  })

  it('should build forward cursor params', () => {
    const after = 'eyJpZCI6IjVlNjFlMWZhMmUyNjU4MjZjNDEzNmUwYiJ9'
    const id = toObjectId('5e61e1fa2e265826c4136e0b')
    const criteria = { title: 'value' }
    const res = buildCursorParams({ first: 100, after, criteria })

    const expected = {
      first: 100,
      after: { id },
      criteria: { title: 'value' },
      limit: 100,
      paginatedField: '_id'
    }

    expect(res).to.eql(expected)
  })

  it('should build backward cursor params', () => {
    const before = 'eyJpZCI6IjVlNjFlMWZhMmUyNjU4MjZjNDEzNmUwYiJ9'
    const criteria = { title: 'value' }
    const res = buildCursorParams({ first: 50, before, criteria })

    const expected = {
      first: 50,
      before: { id: toObjectId('5e61e1fa2e265826c4136e0b') },
      criteria: { title: 'value' },
      limit: 50,
      paginatedField: '_id'
    }

    expect(res).to.eql(expected)
  })

  it('should build sort directives', () => {
    const opts = {
      before: { id: 5 as any },
      criteria: {},
      limit: 50,
      paginatedField: '_id'
    }
    const res = buildSortDirectives(opts)

    expect(res).to.eql({ _id: -1 })
  })

  it('should build sort directives with custom field', () => {
    const opts = {
      limit: 50,
      criteria: {},
      paginatedField: 'name'
    }
    const res = buildSortDirectives(opts)

    expect(res).to.eql({ name: 1, _id: 1 })
  })

  it('should build emty cursor query when before or after is not specified', () => {
    const opts = { criteria: {}, limit: 50, paginatedField: '_id' }
    const res = buildCursorQuery(opts)

    expect(res).to.eql({})
  })

  it('should build forward cursor query', () => {
    const opts = {
      after: { id: 1 },
      criteria: {},
      limit: 50,
      paginatedField: '_id'
    }
    const res = buildCursorQuery(opts as any)

    const expected = { _id: { $gt: 1 } }

    expect(res).to.eql(expected)
  })

  it('should build forward cursor query whith custom paginatedField', () => {
    const opts = {
      after: { id: 5, paginatedField: 'Leon' },
      criteria: {},
      limit: 50,
      paginatedField: 'name'
    }
    const res = buildCursorQuery(opts as any)

    const expected = {
      $or: [
        { name: { $gt: 'Leon' } },
        { name: { $eq: 'Leon' }, _id: { $gt: 5 } }
      ]
    }

    expect(res).to.eql(expected)
  })

  it('should build backward cursor query', () => {
    const opts = {
      before: { id: 5 },
      criteria: {},
      limit: 50,
      paginatedField: '_id'
    }
    const res = buildCursorQuery(opts as any)

    expect(res).to.eql({ _id: { $lt: 5 } })
  })
})
