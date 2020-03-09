import { Context } from '..'
import { errorMessages } from '../../constants'
import { accountService } from '../../services'
import { i18n } from '../../utils'
import {
  validateUser,
  validateAccount,
  validateQueryOptions
} from '../../validations'

const {
  updateFavoriteRecipes,
  updateTriedRecipes,
  updateTastes
} = accountService

export default {
  Query: {
    me: (_: any, __: any, { accountId, dataLoaders }: Context) => {
      return dataLoaders.accountLoader.load(accountId as string)
    },
    account: (_: any, { id }: any, { dataLoaders }: Context) => {
      return dataLoaders.accountLoader.load(id)
    },
    accountByEmail: (_: any, { email }: any, ctx: Context) => {
      return accountService.getAccountByUserInfo({ email }, ctx.dataLoaders)
    },
    accountByPhoneNumber: (_: any, args: any, ctx: Context) => {
      const { phoneNumber } = args
      const { dataLoaders } = ctx

      return accountService.getAccountByUserInfo({ phoneNumber }, dataLoaders)
    },
    accounts: (_: any, { query, page, options }: any, ctx: Context) => {
      const opts = validateQueryOptions({ ...options, page })

      return accountService.getAccounts(query, opts, ctx.dataLoaders)
    }
  },
  Mutation: {
    createAccount: (_: any, { user }: any) => {
      return accountService.addAccountForNewUser(validateUser(user))
    },
    addAccount: (_: any, { user }: any) => {
      return accountService.addAccountForExistingUser(user)
    },
    updateAccount: (_: any, { id, account: data }: any, ctx: Context) => {
      const { isAdmin, accountId } = ctx

      if (accountId !== id && !isAdmin) {
        const message = i18n.t(errorMessages.forbidden)

        return { success: true, message, code: 403, account: null }
      }
      const accountToUpdate = validateAccount(data)

      return accountService.updateAccount(id, accountToUpdate)
    },
    deleteAccount: (_: any, { id }: any, ctx: Context) => {
      const { isAdmin, accountId } = ctx

      if (accountId !== id && !isAdmin) {
        const message = i18n.t(errorMessages.forbidden)

        return { success: true, message, code: 403, account: null }
      }

      return accountService.deleteAccount(id)
    },
    followAccount: (_: any, { account }: any, ctx: Context) => {
      const { dataLoaders, accountId: me } = ctx

      return accountService.followAccount(me as string, account, dataLoaders)
    },
    unFollowAccount: (_: any, { account }: any, ctx: Context) => {
      const { dataLoaders, accountId: me } = ctx

      return accountService.unFollowAccount(me as string, account, dataLoaders)
    },
    addFavoriteRecipe: (_: any, { recipe }: any, ctx: Context) => {
      const { dataLoaders, accountId: me } = ctx

      return updateFavoriteRecipes(me as string, recipe, dataLoaders)
    },
    removeFavoriteRecipe: (_: any, { recipe }: any, ctx: Context) => {
      const { dataLoaders, accountId: me } = ctx

      return updateFavoriteRecipes(me as string, recipe, dataLoaders, false)
    },
    addTriedRecipe: (_: any, { recipe }: any, ctx: Context) => {
      const { dataLoaders, accountId: me } = ctx

      return updateTriedRecipes(me as string, recipe, dataLoaders)
    },
    removeTriedRecipe: (_: any, { recipe }: any, ctx: Context) => {
      const { dataLoaders, accountId: me } = ctx

      return updateTriedRecipes(me as string, recipe, dataLoaders, false)
    },
    addTaste: (_: any, { category }: any, ctx: Context) => {
      const { dataLoaders, accountId: me } = ctx

      return updateTastes(me as string, category, dataLoaders)
    },
    removeTaste: (_: any, { category }: any, ctx: Context) => {
      const { dataLoaders, accountId: me } = ctx

      return updateTastes(me as string, category, dataLoaders, false)
    }
  },
  Account: {
    user: ({ user }: any, _: any, { dataLoaders }: Context) => {
      return dataLoaders.userLoader.load(user)
    },
    followers: ({ followers }: any, args: any, ctx: Context) => {
      const { page, sort } = validateQueryOptions(args)
      const query = { criteria: { followers: { $in: followers } }, sort, page }
      const { accountByQueryLoader } = ctx.dataLoaders

      return { content: accountByQueryLoader.load(query), query }
    },
    followings: ({ _id }: any, args: any, ctx: Context) => {
      const { page, sort } = validateQueryOptions(args)
      const query = { criteria: { followers: _id }, sort, page }
      const { accountByQueryLoader } = ctx.dataLoaders

      return { content: accountByQueryLoader.load(query), query }
    },
    favoriteRecipes: (root: any, args: any, ctx: Context) => {
      const { favoriteRecipes: ids } = root
      const { page, sort } = validateQueryOptions(args)
      const query = { criteria: { favoriteRecipes: { $in: ids } }, sort, page }
      const { accountByQueryLoader } = ctx.dataLoaders

      return { content: accountByQueryLoader.load(query), query }
    },
    triedRrecipes: (root: any, args: any, ctx: Context) => {
      const { triedRrecipes: ids } = root
      const { page, sort } = validateQueryOptions(args)
      const query = { criteria: { triedRrecipes: { $in: ids } }, sort, page }
      const { accountByQueryLoader } = ctx.dataLoaders

      return { content: accountByQueryLoader.load(query), query }
    },
    personalRecipes: ({ _id }: any, args: any, ctx: Context) => {
      const { page, sort } = validateQueryOptions(args)
      const criteria = { authorType: 'Account', author: _id }
      const query = { criteria, sort, page }
      const { recipeByQueryLoader } = ctx.dataLoaders

      return { content: recipeByQueryLoader.load(query), query }
    }
  },
  Accounts: {
    totalCount: ({ query }: any, _: any, { dataLoaders }: Context) => {
      return dataLoaders.accountCountLoader.load(query)
    },
    page: async ({ query }: any, _: any, { dataLoaders }: Context) => {
      const itemsCount = await dataLoaders.accountCountLoader.load(query)
      const pageCount = Math.ceil(itemsCount / query.page.size)

      return { count: pageCount, ...query.page }
    }
  }
}
