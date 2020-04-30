/* eslint-disable quotes */
import { client } from '../setup.test'
import { ADD_CATEGORY, UPDATE_CATEGORY } from './graph'
import categories from './categories.json'
import { toObjectId } from '../../../utils'

// helpers

/** Helper function to add category and return its id */
const addCategory = async (input: any) => {
  const { useMutation } = client
  const ctx = { accountId: String(toObjectId(1)), userRoles: ['ADMIN', 'USER'] }
  const res = await useMutation(ADD_CATEGORY, input, ctx as any)

  return res.data?.addCategory.category
}

const updateCategory = async (input: any) => {
  const { useMutation } = client
  const ctx = { accountId: String(toObjectId(1)), userRoles: ['ADMIN', 'USER'] }
  const res = await useMutation(UPDATE_CATEGORY, input, ctx as any)

  return res.data?.updateCategory.category
}

const addCategories = async () => {
  const dbCategories = await Promise.all(
    categories.map(data => addCategory(data))
  )

  const moroccan = dbCategories.find(c => c.name === 'Moroccan')
  const togo = dbCategories.find(c => c.name === 'Togolese')
  const benin = dbCategories.find(c => c.name === 'Beninese')

  // Parent category
  const cuisine = dbCategories.find(c => c.name === 'Cuisine')
  const input = { parent: cuisine.id, language: 'EN' }

  return Promise.all(
    [togo, moroccan, benin].map(data => updateCategory({ ...data, ...input }))
  )
}

export { addCategories }
