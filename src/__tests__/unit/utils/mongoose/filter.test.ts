import { expect } from 'chai'

import { buildFilterQuery } from '../../../../utils/mongoose/filter'

describe('Mongoose filter builder', () => {
  it('should return empty query when then the filter expression is empty', () => {
    expect(buildFilterQuery({})).to.eql({})
  })

  it('should build simple filter query', () => {
    const filter = { title: { exists: true }, quantity: { lt: 5 } }
    const query = buildFilterQuery(filter)

    const expected = { title: { $exists: true }, quantity: { $lt: 5 } }

    expect(query).to.eql(expected)
  })

  it('should build regex filter query', () => {
    const filter = {
      title: { like: 'value' },
      name: { sw: 'Leon' },
      skill: { ew: 'script' }
    }
    const query = buildFilterQuery(filter)

    const expected = {
      title: { $regex: /value/i },
      name: { $regex: /^Leon/i },
      skill: { $regex: /script$/i }
    }

    expect(query).to.eql(expected)
  })

  it('should build filter query that contains id paths', () => {
    const obj = {
      user: { eq: 'VXNlcjoy' },
      recipes: { in: ['UmVjaXBlOjE=', 'fakeId'] }
    }
    const res = buildFilterQuery(obj, { user: 'User' }, { recipes: 'Recipe' })

    const expected = { user: { $eq: '2' }, recipes: { $in: ['1', null] } }

    expect(res).to.eql(expected)
  })

  it('should build composed filter query with meta operator', () => {
    const filterExp1 = { title: { eq: 'value' } }
    const filterExp2 = { quantity: { gte: 5 } }
    const filter = { or: [filterExp1, filterExp2] }

    const expected = {
      $or: [{ title: { $eq: 'value' } }, { quantity: { $gte: 5 } }]
    }

    expect(buildFilterQuery(filter)).to.eql(expected)
  })
})
