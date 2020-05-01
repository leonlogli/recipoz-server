import { expect } from 'chai'

import { client } from '../setup.test'
import { addCategories } from './util'
import { GET_CATEGORIES } from './graph'

describe('Category graph', () => {
  let dbCategories: any[] = []

  beforeEach(async () => {
    dbCategories = await addCategories()
  })

  it('should get category by id', async () => {
    const expected = dbCategories[0]
    const res = await client.queryNode(expected.id)

    expect(res.data.node).to.eql(expected)
  })

  it('should return null when non-existent category id is specified', async () => {
    const res = await client.queryNode('fakeGlobalId')

    expect(res.data.node).to.equal(null)
  })

  it('should fetch the first two categories', async () => {
    const res = await client.useQuery(GET_CATEGORIES, { first: 2 })

    const { categories } = res.data
    const expectPageInfo = { hasNextPage: true, hasPreviousPage: false }

    expect(categories.totalCount).to.equal(6)
    expect(categories.pageInfo).to.include.keys('startCursor', 'endCursor')
    expect(categories.edges).to.have.lengthOf(2)
    expect(categories.edges[0]).to.have.keys('cursor', 'node')
    expect(categories.edges[1]).to.have.keys('cursor', 'node')
    expect(categories.nodes[0]).to.deep.include({ name: 'Vegetarian' })
    expect(categories.nodes[1]).to.deep.include({ name: 'Togolese' })
    expect(categories.pageInfo).to.include(expectPageInfo)
  })

  it('should fetch the next four categories with a cursor', async () => {
    const { data } = await client.useQuery(GET_CATEGORIES, { first: 2 })
    const after = data.categories.pageInfo.endCursor

    const res = await client.useQuery(GET_CATEGORIES, { first: 4, after })

    const { categories } = res.data
    const expectPageInfo = { hasNextPage: false, hasPreviousPage: true }

    expect(categories.totalCount).to.equal(6)
    expect(categories.pageInfo).to.include.keys('startCursor', 'endCursor')
    expect(categories.edges).to.have.lengthOf(4)
    expect(categories.edges[0]).to.have.keys('cursor', 'node')
    expect(categories.nodes[0]).to.deep.include({ name: 'Beninese' })
    expect(categories.nodes[3]).to.deep.include({ name: 'Cuisine' })
    expect(categories.pageInfo).to.include(expectPageInfo)
  })

  it('should fetch no categories at the end of connection', async () => {
    const { data } = await client.useQuery(GET_CATEGORIES, { first: 6 })
    const after = data.categories.pageInfo.endCursor

    const res = await client.useQuery(GET_CATEGORIES, { first: 2, after })
    const { categories } = res.data

    const pageInfo = {
      hasNextPage: false,
      hasPreviousPage: true,
      startCursor: null,
      endCursor: null
    }

    expect(categories).to.deep.include({ nodes: [], edges: [], pageInfo })
  })
})
