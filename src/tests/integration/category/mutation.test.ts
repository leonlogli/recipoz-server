import { expect } from 'chai'

import { ADD_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY } from './graph'
import { apolloClient as _ } from '../_.test'
import { category } from './data'

describe('Category graph ', () => {
  it('should save category', async () => {
    const res: any = await _.mutate(ADD_CATEGORY, { variables: { category } })

    expect(res.data.addCategory).to.deep.include({
      subCategory: { type: 'HEALTH' },
      name: 'Vegetarian',
      thumbnail: 'https://cloudinary.com/Vegetarian.jpg'
    })
  })

  it('should update category', async () => {
    const m: any = await _.mutate(ADD_CATEGORY, { variables: { category } })
    const { id } = m.data.addCategory

    const res: any = await _.mutate(UPDATE_CATEGORY, {
      variables: { id, category: { name: { en: 'Diabetic' } } }
    })

    expect(res.data.updateCategory).to.deep.include({
      subCategory: { type: 'HEALTH' },
      name: 'Diabetic',
      thumbnail: 'https://cloudinary.com/Vegetarian.jpg'
    })
  })

  it('should report error when updating non-existent category', async () => {
    const res: any = await _.mutate(UPDATE_CATEGORY, {
      variables: { id: '5dff65c2f0500151082ab1f0', category }
    })

    expect(res.errors).to.exist
  })

  it('should delete category', async () => {
    const m: any = await _.mutate(ADD_CATEGORY, { variables: { category } })
    const idOfCategoryToDelete = m.data.addCategory.id

    const res: any = await _.mutate(DELETE_CATEGORY, {
      variables: { id: idOfCategoryToDelete }
    })

    expect(res.data.deleteCategory.id).to.equal(idOfCategoryToDelete)
  })

  it('should report error when deleting non-existent category', async () => {
    const res: any = await _.mutate(DELETE_CATEGORY, {
      variables: { id: '5dff65c2f0500151082ab1f0' }
    })

    expect(res.errors).to.exist
  })
})
