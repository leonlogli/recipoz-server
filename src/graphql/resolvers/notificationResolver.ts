import { ForbiddenError } from 'apollo-server-express'

import { accountService } from '../../services'
import { errorMessages } from '../../constants'
import { i18n } from '../../utils'
import { Context } from '..'

export default {
  Query: {
    myAccount: async (_: any, __: any, { accountId, requireAuth }: Context) => {
      requireAuth()

      return accountService.getAccountById(accountId)
    },
    accountById: async (_: any, { id }: any, { requireAuth }: Context) => {
      requireAuth()

      return accountService.getAccountById(id)
    },
    account: async (_: any, { criteria, filter }: any, ctx: Context) => {
      ctx.requireAuth()

      return accountService.getAccount(criteria, filter)
    },
    accountByUserInfo: async (_: any, { criteria }: any, ctx: Context) => {
      ctx.requireAuth()

      return accountService.getAccountByUserInfo(criteria)
    },
    accounts: async (_: any, { criteria, options }: any, ctx: Context) => {
      ctx.requireAuth()

      return accountService.getAccounts(criteria, options)
    }
  },
  Mutation: {
    createAccount: async (_: any, { user }: any) => {
      return accountService.addAccountForNewUser(user)
    },
    addAccount: async (_: any, { userId }: any) => {
      return accountService.addAccountForExistingUser(userId)
    },
    updateAccount: async (_: any, { id, account }: any, ctx: Context) => {
      const { requireAuth, isAdmin, accountId } = ctx

      requireAuth()

      if (accountId !== id && !isAdmin) {
        throw new ForbiddenError(i18n.t(errorMessages.forbidden))
      }

      return accountService.updateAccount(id, account)
    },
    deleteAccount: async (_: any, { id }: any, ctx: Context) => {
      const { requireAuth, isAdmin, accountId } = ctx

      requireAuth()

      if (accountId !== id && !isAdmin) {
        throw new ForbiddenError(i18n.t(errorMessages.forbidden))
      }

      return accountService.deleteAccount(id)
    },
    followAccount: async (_: any, { account }: any, ctx: Context) => {
      ctx.requireAuth()

      return accountService.followAccount(ctx.accountId, account)
    },
    unFollowAccount: async (_: any, { account }: any, ctx: Context) => {
      ctx.requireAuth()

      return accountService.unFollowAccount(ctx.accountId, account)
    },
    addFavoriteRecipe: async (_: any, { recipe }: any, ctx: Context) => {
      ctx.requireAuth()

      return accountService.updateFavoriteRecipes(ctx.accountId, recipe)
    },
    removeFavoriteRecipe: async (_: any, { recipe }: any, ctx: Context) => {
      ctx.requireAuth()

      return accountService.updateFavoriteRecipes(ctx.accountId, recipe, false)
    },
    addTriedRecipe: async (_: any, { recipe }: any, ctx: Context) => {
      ctx.requireAuth()

      return accountService.updateTriedRecipes(ctx.accountId, recipe)
    },
    removeTriedRecipe: async (_: any, { recipe }: any, ctx: Context) => {
      ctx.requireAuth()

      return accountService.updateTriedRecipes(ctx.accountId, recipe, false)
    },
    addTaste: async (_: any, { category }: any, ctx: Context) => {
      ctx.requireAuth()

      return accountService.updateTastes(ctx.accountId, category)
    },
    removeTaste: async (_: any, { category }: any, ctx: Context) => {
      ctx.requireAuth()

      return accountService.updateTastes(ctx.accountId, category, false)
    }
  },
  Account: {
    user: async ({ user }: any, _: any, { usersLoader }: Context) => {
      return usersLoader.load(user)
    }
  }
}
