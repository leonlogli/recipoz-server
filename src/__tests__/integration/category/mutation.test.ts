import { expect } from 'chai'

import { ADD_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY } from './graph'
import { apolloClient as _ } from '../_.test'
import { vege as category, addCategory } from './data'

describe('Category graph ', () => {
  it('should save category', async () => {
    const res: any = await _.mutate(ADD_CATEGORY, { variables: { category } })

    expect(res.data.addCategory).to.deep.include({ name: 'Vegetarian' })
  })

  it('should update category', async () => {
    const id = await addCategory(category)

    const res: any = await _.mutate(UPDATE_CATEGORY, {
      variables: { id, category: { name: { en: 'Diabetic' } } }
    })

    expect(res.data.updateCategory).to.deep.include({ name: 'Diabetic' })
  })

  it('should report error when updating non-existent category', async () => {
    const res: any = await _.mutate(UPDATE_CATEGORY, {
      variables: { id: '5dff65c2f0500151082ab1f0', category }
    })

    expect(res.errors).to.exist
  })

  it('should delete category', async () => {
    const idOfCategoryToDelete = await addCategory(category)

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
