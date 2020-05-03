import { expect } from 'chai'

import { client } from '../setup.test'
import { addCategories } from './util'
import { GET_CATEGORIES, SEARCH, CATEGORY } from './graph'

describe('Category graph', () => {
  let dbCategories: any[] = []

  beforeEach(async () => {
    dbCategories = await addCategories()
  })

  it('should get category by id', async () => {
    const vege = dbCategories.find(c => c.name === 'Vegetarian')
    const res = await client.queryNode(vege.id)

    expect(res.data.node).to.eql({ id: vege.id, name: 'Vegetarian' })
  })

  it('should return null when non-existent category id is specified', async () => {
    const res = await client.queryNode('fakeGlobalId')

    expect(res.data.node).to.equal(null)
  })

  it('should fetch category with its sub categories', async () => {
    const cuisineId = dbCategories.find(c => c.name === 'Cuisine').id
    const res = await client.useQuery(CATEGORY, { id: cuisineId })

    const expected = {
      nodes: [{ name: 'Togolese' }, { name: 'Beninese' }, { name: 'Moroccan' }]
    }

    expect(res.data.node.subCategories).to.eql(expected)
  })

  it('should fetch category with its parent', async () => {
    const togo = dbCategories.find(c => c.name === 'Togolese').id
    const res = await client.useQuery(CATEGORY, { id: togo })

    expect(res.data.node.parent).to.eql({ name: 'Cuisine' })
  })

  describe('Forward pagination', () => {
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
      const { data } = await client.useQuery(GET_CATEGORIES, { first: 20 })
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

  describe('Backward pagination', () => {
    it('should fetch the last two categories', async () => {
      const res = await client.useQuery(GET_CATEGORIES, { last: 2 })

      const { categories } = res.data
      const expectPageInfo = { hasNextPage: true, hasPreviousPage: false }

      expect(categories.totalCount).to.equal(6)
      expect(categories.pageInfo).to.include.keys('startCursor', 'endCursor')
      expect(categories.edges).to.have.lengthOf(2)
      expect(categories.edges[0]).to.have.keys('cursor', 'node')
      expect(categories.edges[1]).to.have.keys('cursor', 'node')
      expect(categories.nodes[0]).to.deep.include({ name: 'Moroccan' })
      expect(categories.nodes[1]).to.deep.include({ name: 'Cuisine' })
      expect(categories.pageInfo).to.include(expectPageInfo)
    })

    it('should fetch the last four categories with a cursor', async () => {
      const { data } = await client.useQuery(GET_CATEGORIES, { last: 2 })
      const before = data.categories.pageInfo.startCursor

      const res = await client.useQuery(GET_CATEGORIES, { last: 4, before })

      const { categories } = res.data
      const expectPageInfo = { hasNextPage: false, hasPreviousPage: true }

      expect(categories.totalCount).to.equal(6)
      expect(categories.pageInfo).to.include.keys('startCursor', 'endCursor')
      expect(categories.edges).to.have.lengthOf(4)
      expect(categories.edges[0]).to.have.keys('cursor', 'node')
      expect(categories.nodes[0]).to.deep.include({ name: 'Vegetarian' })
      expect(categories.nodes[3]).to.deep.include({ name: 'Breakfast' })
      expect(categories.pageInfo).to.include(expectPageInfo)
    })

    it('should fetch no categories at the end of connection', async () => {
      const { data } = await client.useQuery(GET_CATEGORIES, { last: 20 })
      const before = data.categories.pageInfo.startCursor

      const res = await client.useQuery(GET_CATEGORIES, { last: 2, before })
      const { categories } = res.data

      const pageInfo = {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null
      }

      expect(categories).to.deep.include({ nodes: [], edges: [], pageInfo })
    })
  })

  it('should search categories', async () => {
    const res = await client.useQuery(SEARCH, {
      query: 'cuisine',
      type: 'CATEGORY'
    })
    const { search } = res.data

    expect(search.totalCount).to.equal(4)
    expect(search.page).to.eql({ number: 1, size: 20, count: 1 })
    expect(search.content[0]).to.deep.include({ name: 'Cuisine' })
    expect(search.content[1]).to.deep.include({ name: 'Moroccan' })
    expect(search.content[2]).to.deep.include({ name: 'Togolese' })
    expect(search.content[3]).to.deep.include({ name: 'Beninese' })
  })

  it('should paging category search result', async () => {
    const res = await client.useQuery(SEARCH, {
      query: 'cuisine',
      type: 'CATEGORY',
      pageNumber: 2,
      pageSize: 3
    })
    const { search } = res.data

    expect(search.totalCount).to.equal(4)
    expect(search.page).to.eql({ number: 2, size: 3, count: 2 })
    expect(search.content[0]).to.deep.include({ name: 'Beninese' })
  })
})
