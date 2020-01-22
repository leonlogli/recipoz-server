import { expect } from 'chai'

import { apolloClient as _ } from '../_.test'
import { vege, addCategories, addCategory } from './data'
import {
  GET_CATEGORY,
  GET_CATEGORIES,
  GET_CATEGORY_BY_ID,
  SEARCH_CATEGORIES
} from './graph'

describe('Category graph ', () => {
  it('should get category by id', async () => {
    const id = await addCategory(vege)
    const res: any = await _.query(GET_CATEGORY_BY_ID, {
      variables: { id }
    })

    expect(res.data.categoryById).to.deep.include({ name: 'Vegetarian' })
  })

  it('should get category by name', async () => {
    await addCategories()
    const res: any = await _.query(GET_CATEGORY, {
      variables: { criteria: { name: { en: 'Breakfast' } } }
    })

    expect(res.data.category).to.deep.include({ name: 'Breakfast' })
  })

  it('should report error on getting non-existent category by id', async () => {
    const res: any = await _.query(GET_CATEGORY_BY_ID, {
      variables: { id: '5dff65c2f0500151082ab1f0' }
    })

    expect(res.errors).to.exist
  })

  it('should report error on getting non-existent category by name', async () => {
    const res: any = await _.query(GET_CATEGORY, {
      variables: { criteria: { name: { en: 'notfound' } } }
    })

    expect(res.errors).to.exist
  })

  it('should get all categories', async () => {
    await addCategories()
    const res: any = await _.query(GET_CATEGORIES)
    const { content } = res.data.categories

    expect(content).to.have.lengthOf(8)

    const containsAll = [
      'Beninese',
      'Breakfast',
      'Dinner',
      'Togolese',
      'Vegetarian',
      'Cuisine',
      'Diet',
      'Meal Type'
    ].every(i => content.some((c: any) => c.name === i))

    expect(containsAll).to.eq(true)
  })

  it('should sort fetched categories by name', async () => {
    await addCategories()
    const res: any = await _.query(GET_CATEGORIES, {
      variables: { options: { sort: 'name' } }
    })
    const { content } = res.data.categories

    expect(content).to.have.lengthOf(8)
    expect(content[0]).to.deep.include({ name: 'Beninese' })
    expect(content[1]).to.deep.include({ name: 'Breakfast' })
    expect(content[2]).to.deep.include({ name: 'Cuisine' })
    expect(content[3]).to.deep.include({ name: 'Diet' })
    expect(content[4]).to.deep.include({ name: 'Dinner' })
    expect(content[5]).to.deep.include({ name: 'Meal Type' })
    expect(content[6]).to.deep.include({ name: 'Togolese' })
    expect(content[7]).to.deep.include({ name: 'Vegetarian' })
  })

  it('should filter fetched categories', async () => {
    await addCategories()
    const res: any = await _.query(GET_CATEGORIES, {
      variables: { options: { filter: ['parentCategory.name.like:Cuisine'] } }
    })
    const { content } = res.data.categories
    const containsAll = ['Togolese', 'Beninese'].every(i =>
      content.some((c: any) => c.name === i)
    )

    expect(content).to.have.lengthOf(2)
    expect(containsAll).to.eq(true)
  })

  it('should get categories by name', async () => {
    await addCategories()
    const res: any = await _.query(GET_CATEGORIES, {
      variables: { criteria: { name: { en: 'Breakfast' } } }
    })
    const { content } = res.data.categories

    expect(content).to.have.lengthOf(1)
    expect(content[0]).to.deep.include({ name: 'Breakfast' })
  })

  it('should search categories by full text', async () => {
    await addCategories()
    const res: any = await _.query(SEARCH_CATEGORIES, {
      variables: { criteria: { searchText: 'Cuisine' } }
    })
    const { content } = res.data.searchCategories
    const containsAll = ['Togolese', 'Beninese', 'Cuisine'].every(i =>
      content.some((c: any) => c.name === i)
    )

    expect(content).to.have.lengthOf(3)
    expect(containsAll).to.eq(true)
  })

  it('should search categories by partial text', async () => {
    await addCategories()
    const res: any = await _.query(SEARCH_CATEGORIES, {
      variables: {
        criteria: { searchText: 'Cuis', searchType: 'PARTIAL_TEXT' }
      }
    })
    const { content } = res.data.searchCategories
    const containsAll = ['Togolese', 'Beninese', 'Cuisine'].every(i =>
      content.some((c: any) => c.name === i)
    )

    expect(content).to.have.lengthOf(3)
    expect(containsAll).to.eq(true)
  })

  it('should get paged categories with default params', async () => {
    await addCategories()
    const res: any = await _.query(GET_CATEGORIES, {
      variables: { options: { page: {} } }
    })
    const { content, page, totalElements } = res.data.categories

    expect(content).to.have.lengthOf(8)
    expect(totalElements).to.equal(8)
    expect(page).to.deep.include({
      number: 1,
      count: 1,
      size: 20
    })
  })

  it('should get paged categories', async () => {
    await addCategories()
    const res: any = await _.query(GET_CATEGORIES, {
      variables: { options: { page: { number: 1, size: 4 } } }
    })
    const { content, page, totalElements } = res.data.categories

    expect(content).to.have.lengthOf(4)
    expect(totalElements).to.equal(8)
    expect(page).to.deep.include({
      number: 1,
      count: 2,
      size: 4
    })
  })
})
