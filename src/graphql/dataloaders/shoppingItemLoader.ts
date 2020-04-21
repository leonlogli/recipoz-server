import DataLoader from 'dataloader'

import { shoppingListService } from '../../services'
import { dataByQueryLoaderOptions as options } from '../../utils'

const {
  getShoppingListItemsByBatch,
  getShoppingListItem,
  countShoppingListItemsByBatch
} = shoppingListService

const shoppingListItemLoader = () => new DataLoader(getShoppingListItem)

const shoppingListItemByQueryLoader = () => {
  return new DataLoader(getShoppingListItemsByBatch, options)
}

const shoppingListItemCountLoader = () => {
  return new DataLoader(countShoppingListItemsByBatch, options)
}

export {
  shoppingListItemLoader,
  shoppingListItemByQueryLoader,
  shoppingListItemCountLoader
}
