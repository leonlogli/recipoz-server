import { expect } from 'chai'

import { apolloClient as _ } from '../_.test'
import * as categoriesData from './data'
import {
  GET_PAGED_CATEGORIES,
  GET_PAGED_CATEGORIES_BY,
  ADD_CATEGORY
} from './graph'

describe('Category graph ', () => {
  const addCategories = async () => {
    return Promise.all(
      Object.values(categoriesData).map(category =>
        _.mutate(ADD_CATEGORY, { variables: { category } })
      )
    )
  }

  it('should get paged categories with default params', async () => {
    await addCategories()

    const res: any = await _.query(GET_PAGED_CATEGORIES)
    const { pagedCategories } = res.data

    expect(pagedCategories.page).to.deep.include({
      number: 1,
      count: 1,
      size: 20,
      totalItems: 5
    })
  })

  it('should get paged categories', async () => {
    await addCategories()

    const res: any = await _.query(GET_PAGED_CATEGORIES, {
      variables: { options: { page: 1, limit: 2 } }
    })
    const { pagedCategories } = res.data

    expect(pagedCategories.page).to.deep.include({
      number: 1,
      count: 3,
      size: 2,
      totalItems: 5
    })
  })

  it('should paged categories using full search text criteria', async () => {
    await addCategories()

    const res: any = await _.query(GET_PAGED_CATEGORIES, {
      variables: { criteria: 'Breakfast', options: { page: 1, limit: 1 } }
    })

    const { pagedCategories } = res.data

    expect(pagedCategories.page).to.deep.include({
      number: 1,
      count: 1,
      size: 1,
      totalItems: 1
    })
  })

  it('should paged categories using partial search text criteria', async () => {
    await addCategories()

    const res: any = await _.query(GET_PAGED_CATEGORIES, {
      variables: { criteria: 'break', options: { page: 1, limit: 1 } }
    })
    const { pagedCategories } = res.data

    expect(pagedCategories.page).to.deep.include({
      number: 1,
      count: 1,
      size: 1,
      totalItems: 1
    })
  })

  it('should get paged categories by name', async () => {
    await addCategories()

    const res: any = await _.query(GET_PAGED_CATEGORIES_BY, {
      variables: { criteria: { name: { en: 'Breakfast' } } }
    })
    const { pagedCategoriesBy } = res.data

    expect(pagedCategoriesBy.page).to.deep.include({
      number: 1,
      count: 1,
      size: 20,
      totalItems: 1
    })
  })
})
