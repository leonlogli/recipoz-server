import { expect } from 'chai'

import { ADD_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY } from './graph'
import { client } from '../setup.test'
import categories from './categories.json'
import { toObjectId } from '../../../utils'
import { addCategories } from './util'

describe('Category graph ', () => {
  beforeEach(async () => {
    client.setContext({
      accountId: String(toObjectId(1)),
      userRoles: ['ADMIN', 'USER']
    })
  })

  describe('Add new product', () => {
    it('should properly save category', async () => {
      const vege = categories[0]
      const { data } = await client.useMutation(ADD_CATEGORY, vege)

      const expected = { success: true, code: '201' }

      expect(data.addCategory).to.deep.include(expected)
      expect(data.addCategory.category).to.deep.include({ name: 'Vegetarian' })
    })

    it('should throw authentication error if the current user is not admin', async () => {
      const ctx = { accountId: String(toObjectId(1)), userRoles: ['USER'] }
      const input = categories[0]

      const res = await client.useMutation(ADD_CATEGORY, input, ctx as any)

      expect(res.data).to.equal(null)
      expect(res.errors[0].extensions.code).to.deep.include('FORBIDDEN')
    })

    it('should throw invalid error when providing invalid input', async () => {
      const input = { name: '', thumbnail: 'https://test.com', language: 'EN' }

      const res = await client.useMutation(ADD_CATEGORY, input)

      expect(res.data).to.equal(null)
      expect(res.errors[0].message).to.equal('Invalid input')
    })
  })

  describe('Update new product', () => {
    it('should properly update category', async () => {
      const dbCategories = await addCategories()
      const input = { id: dbCategories[0].id, name: 'Updated', language: 'EN' }

      const { data } = await client.useMutation(UPDATE_CATEGORY, input)

      const expected = { success: true, code: '200' }

      expect(data.updateCategory).to.deep.include(expected)
      expect(data.updateCategory.category).to.deep.include({ name: 'Updated' })
    })

    it('should return 404 error when updating non-existent category', async () => {
      const input = {
        id: 'Q2F0ZWdvcnk6NWU2MWUxZmEyZTI2NTgyNmM0MTM2ZTBi',
        language: 'EN'
      }
      const res = await client.useMutation(UPDATE_CATEGORY, input)

      const expected = { success: false, code: '404', category: null }

      expect(res.data.updateCategory).to.deep.include(expected)
    })
  })

  it('should properly delete category', async () => {
    const dbCategories = await addCategories()
    const input = { id: dbCategories[0].id }

    const res = await client.useMutation(DELETE_CATEGORY, input)

    const expected = { success: true, code: '200' }

    expect(res.data.deleteCategory).to.deep.include(expected)
    expect(res.data.deleteCategory.category).to.deep.include({
      name: 'Vegetarian'
    })
  })
})
