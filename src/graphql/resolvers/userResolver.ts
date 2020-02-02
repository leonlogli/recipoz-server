import { AuthenticationError, ForbiddenError } from 'apollo-server-express'

import { i18n } from '../../utils'
import { accountService, userService } from '../../services'
import { errorMessages } from '../../constants'
import { Context } from '../context'

export default {
  Query: {
    accessToken: async (parent: any, { authToken }: any) => {
      const { userId, roles }: any = await userService.verifyIdToken(authToken)
      const account = await accountService.getAccountAndSelect(
        { user: userId },
        '_id'
      )

      if (account) {
        return userService.generateAccessToken({ id: account._id, roles })
      }
      throw new AuthenticationError(i18n.t(errorMessages.accessDenied))
    }
  },
  Mutation: {
    revokeRefreshTokens: async (_: any, { accountId }: any, ctx: Context) => {
      const { requireAuth, isAdmin } = ctx

      requireAuth()

      if (!isAdmin) {
        throw new ForbiddenError(i18n.t(errorMessages.forbidden))
      }
      const account: any = await accountService.getAccountById(accountId)

      await userService.revokeRefreshTokens(account.user)

      return account
    },
    setUserRoles: async (_: any, { accountId, roles }: any, ctx: Context) => {
      const { requireAuth, isAdmin } = ctx

      requireAuth()

      if (!isAdmin) {
        throw new ForbiddenError(i18n.t(errorMessages.forbidden))
      }
      const account: any = await accountService.getAccountById(accountId)

      await userService.setUserRoles(account.user, ...roles)

      return account
    }
  }
}
