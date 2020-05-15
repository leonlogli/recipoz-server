import DataLoader from 'dataloader'

import { shoppingListService } from '../../services'
import { dataByQueryLoaderOptions as options, prime } from '../../utils'

const {
  getShoppingListItemsByBatch,
  getShoppingListItem,
  countShoppingListItemsByBatch
} = shoppingListService

const shoppingListItemLoader = () => new DataLoader(getShoppingListItem)

type ShoppingListItemLoader = ReturnType<typeof shoppingListItemLoader>

const shoppingListItemByQueryLoader = (loader: ShoppingListItemLoader) => {
  return new DataLoader(async queries => {
    const res = await getShoppingListItemsByBatch(queries as any)

    for (const page of res) {
      prime(loader, ...page.nodes)
    }

    return res
  }, options)
}

const shoppingListItemCountLoader = () => {
  return new DataLoader(countShoppingListItemsByBatch, options)
}

export {
  shoppingListItemLoader,
  shoppingListItemByQueryLoader,
  shoppingListItemCountLoader
}
