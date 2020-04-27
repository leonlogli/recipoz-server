import { expect } from 'chai'

import { buildPagedResponse } from '../../../../../utils/mongoose/pagination/result'

describe('Cursor pagination', () => {
  describe('Connection result', () => {
    const docs = [
      { _id: 1, name: 'Leon Logli' },
      { _id: 2, name: 'John Smith' },
      { _id: 3, name: 'Bird Ramsey' }
    ]

    it('should return empty relay connection response', () => {
      const query = {
        criteria: {},
        limit: 50,
        paginatedField: 'name'
      }
      const res = buildPagedResponse([], query as any)

      const pageInfo = { hasNextPage: false, hasPreviousPage: false }
      const expected = { nodes: [], totalCount: 0, edges: [], pageInfo, query }

      expect(res).to.eql(expected)
    })

    it('should the correct forward pagination result', () => {
      const query = { limit: 2, paginatedField: '_id' }
      const res = buildPagedResponse(docs as any, query as any)

      const hasPreviousPage = false

      expect(res.pageInfo).to.include({ hasPreviousPage, hasNextPage: true })
      expect(res.pageInfo).to.haveOwnProperty('startCursor')
      expect(res.pageInfo).to.haveOwnProperty('endCursor')
      expect(res).to.not.haveOwnProperty('totalCount')
      expect(res.edges)
        .to.be.an('array')
        .that.has.lengthOf(2)
      expect(res.edges[0]).to.haveOwnProperty('cursor')
      expect(res.edges[0].node).to.include({ _id: 1, name: 'Leon Logli' })
    })

    it('should the correct backward pagination result', () => {
      const query = { before: {} as any, limit: 2, paginatedField: '_id' }
      const res = buildPagedResponse(docs as any, query as any)

      const hasPreviousPage = false

      expect(res.pageInfo).to.include({ hasNextPage: true, hasPreviousPage })
      expect(res).to.not.haveOwnProperty('totalCount')
      expect(res.edges)
        .to.be.an('array')
        .that.has.lengthOf(2)
      expect(res.edges[0]).to.haveOwnProperty('cursor')
      expect(res.edges[0].node).to.include({ _id: 2, name: 'John Smith' })
    })
  })
})
