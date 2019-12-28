/* eslint-disable max-lines */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { createTestClient } from 'apollo-server-integration-testing'

import { apolloServer } from '../../../..'
import {
  ADD_CATEGORY,
  GET_CATEGORY_BY,
  GET_CATEGORY,
  DELETE_CATEGORY,
  GET_CATEGORIES,
  GET_CATEGORIES_BY,
  GET_PAGED_CATEGORIES,
  GET_PAGED_CATEGORIES_BY,
  UPDATE_CATEGORY
} from './_.test'

const { query, mutate } = createTestClient({ apolloServer } as any)

describe('Category graph ', () => {
  const category = {
    subCategory: { type: 'DIET' },
    name: { en: 'test' },
    thumbnail: 'https://cloudinary.com/test.jpg'
  }
  const category2 = {
    subCategory: { type: 'CUISINE' },
    name: { en: 'Ghanaian' },
    thumbnail: 'https://cloudinary.com/Ghanaian.jpg'
  }

  const addCategories = async () => {
    return Promise.all([
      mutate(ADD_CATEGORY, { variables: { category } }),
      mutate(ADD_CATEGORY, { variables: { category: category2 } })
    ])
  }

  it('should save category', async () => {
    const res: any = await mutate(ADD_CATEGORY, { variables: { category } })

    expect(res.data.addCategory).to.deep.include({
      subCategory: { type: 'DIET' },
      name: 'test',
      thumbnail: 'https://cloudinary.com/test.jpg'
    })
  })

  it('should update category', async () => {
    const m: any = await mutate(ADD_CATEGORY, { variables: { category } })
    const { id } = m.data.addCategory

    const res: any = await mutate(UPDATE_CATEGORY, {
      variables: { id, category: { name: { en: 'updated category' } } }
    })

    expect(res.data.updateCategory).to.deep.include({
      subCategory: { type: 'DIET' },
      name: 'updated category',
      thumbnail: 'https://cloudinary.com/test.jpg'
    })
  })

  it('should report error when updating non-existent category', async () => {
    const res: any = await mutate(UPDATE_CATEGORY, {
      variables: { id: '5dff65c2f0500151082ab1f0', category }
    })

    expect(res.errors).to.exist
  })

  it('should delete category', async () => {
    const m: any = await mutate(ADD_CATEGORY, { variables: { category } })
    const idOfCategoryToDelete = m.data.addCategory.id

    const res: any = await mutate(DELETE_CATEGORY, {
      variables: { id: idOfCategoryToDelete }
    })

    expect(res.data.deleteCategory.id).to.equal(idOfCategoryToDelete)
  })

  it('should report error when deleting non-existent category', async () => {
    const res: any = await mutate(DELETE_CATEGORY, {
      variables: { id: '5dff65c2f0500151082ab1f0' }
    })

    expect(res.errors).to.exist
  })

  it('should get category by name', async () => {
    await mutate(ADD_CATEGORY, { variables: { category } })

    const res: any = await query(GET_CATEGORY_BY, {
      variables: { criteria: { name: { en: 'test' } } }
    })

    expect(res.data.categoryBy).to.deep.include({ name: 'test' })
  })

  it('should get category by id', async () => {
    category.name = { en: 'test' }
    const m: any = await mutate(ADD_CATEGORY, { variables: { category } })

    const res: any = await query(GET_CATEGORY, {
      variables: { id: m.data.addCategory.id }
    })

    expect(res.data.category).to.deep.include({ name: 'test' })
  })

  it('should report error on getting non-existent category by id', async () => {
    const res: any = await query(GET_CATEGORY, {
      variables: { id: '5dff65c2f0500151082ab1f0' }
    })

    expect(res.errors).to.exist
  })

  it('should report error on getting non-existent category by name', async () => {
    const res: any = await query(GET_CATEGORY_BY, {
      variables: { criteria: { name: { en: 'notfound' } } }
    })

    expect(res.errors).to.exist
  })

  it('should get categories', async () => {
    await addCategories()

    const res: any = await query(GET_CATEGORIES)
    const { categories } = res.data

    expect(categories).to.have.lengthOf(2)

    const hasName = categories.some((c: any) => c.name === 'test')
    const hasName2 = categories.some((c: any) => c.name === 'Ghanaian')

    expect(hasName && hasName2).to.eq(true)
  })

  it('should sort fetched categories', async () => {
    await addCategories()

    const res: any = await query(GET_CATEGORIES, {
      variables: { sort: 'name' }
    })
    const { categories } = res.data

    expect(categories).to.have.lengthOf(2)
    expect(categories[0]).to.deep.include({ name: 'Ghanaian' })
    expect(categories[1]).to.deep.include({ name: 'test' })
  })

  it('should get categories by name', async () => {
    await addCategories()

    const res: any = await query(GET_CATEGORIES_BY, {
      variables: { criteria: { name: { en: 'test' } } }
    })
    const { categoriesBy } = res.data

    expect(categoriesBy).to.have.lengthOf(1)
    expect(categoriesBy[0]).to.deep.include({ name: 'test' })
  })

  it('should get paged categories with default params', async () => {
    await addCategories()

    const res: any = await query(GET_PAGED_CATEGORIES)
    const { pagedCategories } = res.data

    expect(pagedCategories.page).to.deep.include({
      number: 1,
      count: 1,
      size: 20,
      totalItems: 2
    })
  })

  it('should get paged categories', async () => {
    await addCategories()

    const res: any = await query(GET_PAGED_CATEGORIES, {
      variables: { options: { page: 1, limit: 1 } }
    })
    const { pagedCategories } = res.data

    expect(pagedCategories.page).to.deep.include({
      number: 1,
      count: 2,
      size: 1,
      totalItems: 2
    })
  })

  it('should paged categories using full search text criteria', async () => {
    await addCategories()

    const res: any = await query(GET_PAGED_CATEGORIES, {
      variables: { criteria: 'test', options: { page: 1, limit: 1 } }
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

    const res: any = await query(GET_PAGED_CATEGORIES, {
      variables: { criteria: 'ghana', options: { page: 1, limit: 1 } }
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

    const res: any = await query(GET_PAGED_CATEGORIES_BY, {
      variables: { criteria: { name: { en: 'test' } } }
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
