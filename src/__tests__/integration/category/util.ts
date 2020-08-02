import { client } from '../setup.test'
import { ADD_CATEGORY } from './graph'
import categories from './categories.json'
import { toObjectId } from '../../../utils'

const addCategory = async (input: any) => {
  const { useMutation } = client
  const ctx = { accountId: String(toObjectId(1)), userRoles: ['ADMIN', 'USER'] }
  const res = await useMutation(ADD_CATEGORY, input, ctx as any)

  return res.data?.addCategory.category
}

const addCategories = async () => {
  const dbCategories = await Promise.all(
    categories.map(data => addCategory(data))
  )

  return dbCategories
}

export { addCategories }
