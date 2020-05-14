import { ShoppingListItem, ShoppingListItemDocument } from '../../models'
import { DataLoaders, i18n, errorRes, locales } from '../../utils'
import { ModelService } from '../base'
import addItems from './addItems'

const { statusMessages, errorMessages } = locales
const { notFound } = errorMessages.shoppingListItem
const { deleted, updated } = statusMessages.shoppingListItem
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
  ...addItems(shoppingListModel),
  getShoppingListItem,
  getShoppingListItems,
  countShoppingListItemsByBatch,
  getShoppingListItemsByBatch,
  getShoppingListItemAndSelect,
  deleteShoppingListItem,
  updateShoppingListItem,
  clearCheckedItems,
  clearShoppingList
}
export default shoppingListService
