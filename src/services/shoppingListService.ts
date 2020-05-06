import { ShoppingListItem, ShoppingListItemDocument } from '../models'
import {
  DataLoaders,
  i18n,
  removeUndefinedKeys,
  getIngredientCategory,
  errorRes,
  locales
} from '../utils'
import ModelService from './base/ModelService'

const { statusMessages, errorMessages } = locales
const { notFound } = errorMessages.shoppingListItem
const { internalServerError } = errorMessages
const { deleted, updated, added } = statusMessages.shoppingListItem
const { t } = i18n

const shoppingListModel = new ModelService<ShoppingListItemDocument>({
  model: ShoppingListItem,
  onNotFound: notFound
})

const countShoppingListItemsByBatch = shoppingListModel.countByBatch
const getShoppingListItem = shoppingListModel.findByIds
const getShoppingListItemsByBatch = shoppingListModel.batchFind
const getShoppingListItemAndSelect = shoppingListModel.findOne
const getShoppingListItems = shoppingListModel.search

const addShoppingListItem = async (input: any, loaders: DataLoaders) => {
  try {
    const { account, name, quantity, recipe } = input
    let query: any = removeUndefinedKeys({ account, name, quantity })
    const category = getIngredientCategory(name)
    let data: any = { $set: input, $setOnInsert: { category } }

    if (recipe) {
      const doc = await loaders.recipeLoader.load(recipe)

      if (doc.ingredients.find((i: any) => i.name === name)) {
        query = { account, name, recipe }
      } else data = { ...data, $set: { ...input, recipe: undefined } }
    }
    const shoppingListItem = await shoppingListModel.createOrUpdate(query, data)
    const message = t(added, { count: 1 })

    return { success: true, message, code: 200, shoppingListItem }
  } catch (error) {
    return errorRes(error)
  }
}

const addShoppingListItems = async (input: any, loaders: DataLoaders) => {
  try {
    const { recipe, account, items } = input
    const data: any[] = items.map((item: any) => ({ ...item, recipe, account }))

    const res = await Promise.all(
      data.map(item => addShoppingListItem(item, loaders))
    )
    const shoppingListItems = res.filter(addedItem => addedItem.success)
    const success = shoppingListItems.length > 0
    const successMsg = t(added, { count: shoppingListItems.length })
    const message = success ? successMsg : t(internalServerError)

    return { success, message, code: success ? 201 : 500, shoppingListItems }
  } catch (error) {
    return errorRes(error)
  }
}

const suitableErrorResponse = async (itemId: any) => {
  const exists = await shoppingListModel.exists(itemId)
  const message = t(exists ? errorMessages.forbidden : notFound)

  return { success: false, message, code: exists ? 403 : 404 }
}

const updateShoppingListItem = async (input: any, loaders: DataLoaders) => {
  try {
    const { id: _id, account, ...data } = input
    const set = { $set: data }
    const query = { _id, account }

    const item = await shoppingListModel.updateOne(query, set, loaders)
    const message = t(updated)
    const res = { success: true, message, code: 200, shoppingListItem: item }

    return item ? res : suitableErrorResponse(_id)
  } catch (error) {
    return errorRes(error)
  }
}

const deleteShoppingListItem = async (input: any) => {
  try {
    const { id: _id, account } = input

    const shoppingListItem = await shoppingListModel.deleteOne({ _id, account })
    const message = t(deleted, { count: 1 })
    const res = { success: true, message, code: 200, shoppingListItem }

    return shoppingListItem ? res : suitableErrorResponse(_id)
  } catch (error) {
    return errorRes(error)
  }
}

const clearCheckedItems = async (accountId: any, loaders: DataLoaders) => {
  try {
    const query = { account: accountId, checked: true }
    const count = await loaders.shoppingListItemCountLoader.load(query)

    const res = await ShoppingListItem.deleteMany(query).exec()
    const deletedCount = res.deletedCount || 0
    const message = t(deleted, { count: deletedCount })

    return { success: deletedCount === count, message, code: 200, deletedCount }
  } catch (error) {
    return errorRes(error)
  }
}

const clearShoppingList = async (accountId: any, loaders?: DataLoaders) => {
  try {
    const query = { account: accountId }
    const count = await loaders?.shoppingListItemCountLoader.load(query)

    const res = await ShoppingListItem.deleteMany(query).exec()
    const deletedCount = res.deletedCount || 0
    const message = t(deleted, { count: deletedCount })

    return { success: deletedCount === count, message, code: 200, deletedCount }
  } catch (error) {
    return errorRes(error)
  }
}

export const shoppingListService = {
  getShoppingListItem,
  getShoppingListItems,
  countShoppingListItemsByBatch,
  getShoppingListItemsByBatch,
  getShoppingListItemAndSelect,
  addShoppingListItem,
  deleteShoppingListItem,
  updateShoppingListItem,
  addShoppingListItems,
  clearCheckedItems,
  clearShoppingList
}
export default shoppingListService
