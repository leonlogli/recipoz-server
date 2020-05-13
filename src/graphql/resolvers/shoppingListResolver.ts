import { shoppingListService } from '../../services'
import { Context } from '../context'
import {
  validateShoppingListItem,
  validateShoppingListItems,
  validateCursorQuery
} from '../../validations'
import { emptyConnection, toLocalId, withClientMutationId } from '../../utils'

export default {
  Query: {
    shoppingList: (_: any, { account, filter, ...opts }: any, ctx: Context) => {
      const { id } = toLocalId(account, 'Account')

      if (!id) {
        return emptyConnection()
      }
      const criteria = { account: id, ...filter }
      const cursorQuery = validateCursorQuery(opts)
      const { shoppingListItemByQueryLoader } = ctx.dataLoaders

      return shoppingListItemByQueryLoader.load({ ...cursorQuery, criteria })
    },
    myShoppingList: (_: any, { filter, ...opts }: any, ctx: Context) => {
      const id = ctx.accountId && toLocalId(ctx.accountId, 'Account').id

      if (!id) {
        return emptyConnection()
      }
      const criteria = { account: id, ...filter }
      const cursorQuery = validateCursorQuery(opts)
      const { shoppingListItemByQueryLoader } = ctx.dataLoaders

      return shoppingListItemByQueryLoader.load({ ...cursorQuery, criteria })
    }
  },
  Mutation: {
    addShoppingListItem: (_: any, { input }: any, ctx: Context) => {
      const { accountId: account, dataLoaders: loaders } = ctx
      const { id: recipe } = input.recipe && toLocalId(input.recipe, 'Recipe')

      const data = validateShoppingListItem({ ...input, recipe, account })
      const payload = shoppingListService.addShoppingListItem(data, loaders)

      return withClientMutationId(payload, input)
    },
    addShoppingListItems: (_: any, { input }: any, ctx: Context) => {
      const { accountId: account, dataLoaders: loaders } = ctx
      const { id: recipe } = toLocalId(input.recipe, 'Recipe')

      const data = validateShoppingListItems({ ...input, recipe, account })
      const payload = shoppingListService.addShoppingListItem(data, loaders)

      return withClientMutationId(payload, input)
    },
    updateShoppingListItem: (_: any, { input }: any, ctx: Context) => {
      const { accountId: account, dataLoaders: loaders } = ctx
      const { id } = toLocalId(input.id, 'ShoppingListItem')

      const data = validateShoppingListItem({ ...input, id, account }, false)
      const payload = shoppingListService.updateShoppingListItem(data, loaders)

      return withClientMutationId(payload, input)
    },
    deleteShoppingListItem: (_: any, { input }: any, ctx: Context) => {
      const { accountId: account } = ctx
      const { id } = toLocalId(input.id, 'ShoppingListItem')

      const data = validateShoppingListItem({ id, account }, false)
      const payload = shoppingListService.deleteShoppingListItem(data)

      return withClientMutationId(payload, input)
    },
    clearCheckedItems: (_: any, { input }: any, ctx: Context) => {
      const { accountId, dataLoaders: loaders } = ctx
      const payload = shoppingListService.clearCheckedItems(accountId, loaders)

      return withClientMutationId(payload, input)
    },
    clearShoppingList: (_: any, { input }: any, ctx: Context) => {
      const { accountId, dataLoaders: loaders } = ctx
      const payload = shoppingListService.clearShoppingList(accountId, loaders)

      return withClientMutationId(payload, input)
    }
  },
  ShoppingListItem: {
    account: async ({ account }: any, _: any, ctx: Context) => {
      const { accountLoader } = ctx.dataLoaders

      return accountLoader.load(account)
    },
    recipe: async ({ recipe }: any, _: any, ctx: Context) => {
      const { recipeLoader } = ctx.dataLoaders

      return recipeLoader.load(recipe)
    }
  },
  ShoppingListItemConnection: {
    totalCount: ({ totalCount, query }: any, _: any, ctx: Context) => {
      const { shoppingListItemCountLoader } = ctx.dataLoaders

      return totalCount || shoppingListItemCountLoader.load(query.criteria)
    }
  }
}
