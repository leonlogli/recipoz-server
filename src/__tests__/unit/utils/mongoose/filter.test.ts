import { expect } from 'chai'

import { buildFilterQuery } from '../../../../utils/mongoose/filter'
import { toObjectId } from '../../../../utils'

describe('Mongoose filter builder', () => {
  it('should return empty query when then the filter expression is empty', () => {
    expect(buildFilterQuery({})).to.eql({})
  })

  it('should build simple filter query', () => {
    const filter = { quantity: { lt: 5 } }

    expect(buildFilterQuery(filter)).to.eql({ quantity: { $lt: 5 } })
  })

  it('should build filter query with dotted path', () => {
    const filter = { ingredients: { name: { eq: 'tomato' } } }
    const expected = { 'ingredients.name': { $eq: 'tomato' } }

    expect(buildFilterQuery(filter)).to.eql(expected)
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
    const query = { user: { eq: 'VXNlcjo1ZWRiZjJjNTY4MDQxNDU2ZTQxN2NhZWI=' } }
    const res = buildFilterQuery(query, { user: 'User' })
    const expectedId = toObjectId('5edbf2c568041456e417caeb')

    expect(res).to.eql({ user: { $eq: expectedId } })
  })

  it('should build filter query that contains array of ids', () => {
    const query = {
      recipes: {
        in: ['UmVjaXBlOjAwMDAwMDAxYmE3MmQxNTY0ODgzOTExYg==', 'fakeId']
      }
    }

    const res = buildFilterQuery(query, { recipes: 'Recipe' })
    const expectedIds = [toObjectId('00000001ba72d1564883911b'), null]

    expect(res).to.eql({ recipes: { $in: expectedIds } })
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

  it('should build complex deep filter query with meta operator and dotted field', () => {
    const filter = {
      instructions: { text: { like: 'fry' } },
      or: [
        { cuisine: { sw: 'Africa' } },
        { ingredients: { group: { eq: 'sauce' } } },
        {
          and: [
            { ingredients: { name: { ew: 'egg' } } },
            { title: { nin: ['Rice'] } }
          ]
        }
      ]
    }

    const expected = {
      $or: [
        { cuisine: { $regex: /^Africa/i } },
        { 'ingredients.group': { $eq: 'sauce' } },
        {
          $and: [
            { 'ingredients.name': { $regex: /egg$/i } },
            { title: { $nin: ['Rice'] } }
          ]
        }
      ],
      'instructions.text': { $regex: /fry/i }
    }

    expect(buildFilterQuery(filter)).to.eql(expected)
  })
})
