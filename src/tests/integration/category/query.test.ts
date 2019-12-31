import { expect } from 'chai'

import { apolloClient as _ } from '../_.test'
import * as categoriesData from './data'
import {
  ADD_CATEGORY,
  GET_CATEGORY_BY,
  GET_CATEGORY,
  GET_CATEGORIES,
  GET_CATEGORIES_BY
} from './graph'

describe('Category graph ', () => {
  const addCategories = async () => {
    return Promise.all(
      Object.values(categoriesData).map(category =>
        _.mutate(ADD_CATEGORY, { variables: { category } })
      )
    )
  }

  const { category } = categoriesData

  it('should get category by id', async () => {
    const m: any = await _.mutate(ADD_CATEGORY, { variables: { category } })

    const res: any = await _.query(GET_CATEGORY, {
      variables: { id: m.data.addCategory.id }
    })

    expect(res.data.category).to.deep.include({ name: 'Vegetarian' })
  })

  it('should get category by name', async () => {
    await addCategories()

    const res: any = await _.query(GET_CATEGORY_BY, {
      variables: { criteria: { name: { en: 'Birthday' } } }
    })

    expect(res.data.categoryBy).to.deep.include({ name: 'Birthday' })
  })

  it('should report error on getting non-existent category by id', async () => {
    const res: any = await _.query(GET_CATEGORY, {
      variables: { id: '5dff65c2f0500151082ab1f0' }
    })

    expect(res.errors).to.exist
  })

  it('should report error on getting non-existent category by name', async () => {
    const res: any = await _.query(GET_CATEGORY_BY, {
      variables: { criteria: { name: { en: 'notfound' } } }
    })

    expect(res.errors).to.exist
  })

  it('should get categories', async () => {
    await addCategories()

    const res: any = await _.query(GET_CATEGORIES)
    const { categories } = res.data

    expect(categories).to.have.lengthOf(5)

    const containsAll = [
      'Birthday',
      'Breakfast',
      'Dinner',
      'Togolese',
      'Vegetarian'
    ].every(i => categories.some((c: any) => c.name === i))

    expect(containsAll).to.eq(true)
  })

  it('should sort fetched categories', async () => {
    await addCategories()

    const res: any = await _.query(GET_CATEGORIES, {
      variables: { sort: 'name' }
    })
    const { categories } = res.data

    expect(categories).to.have.lengthOf(5)
    expect(categories[0]).to.deep.include({ name: 'Birthday' })
    expect(categories[1]).to.deep.include({ name: 'Breakfast' })
    expect(categories[2]).to.deep.include({ name: 'Dinner' })
    expect(categories[3]).to.deep.include({ name: 'Togolese' })
    expect(categories[4]).to.deep.include({ name: 'Vegetarian' })
  })

  it('should get categories by name', async () => {
    await addCategories()

    const res: any = await _.query(GET_CATEGORIES_BY, {
      variables: { criteria: { name: { en: 'Birthday' } } }
    })
    const { categoriesBy } = res.data

    expect(categoriesBy).to.have.lengthOf(1)
    expect(categoriesBy[0]).to.deep.include({ name: 'Birthday' })
  })
})
