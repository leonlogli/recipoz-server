import { errorMessages, statusMessages } from '../../constants'
import { accountService, userService } from '../../services'
import { i18n, AuthenticationError } from '../../utils'
import { Context } from '../context'

export default {
  Query: {
    accessToken: async (parent: any, { authToken }: any) => {
      const { user, roles }: any = await userService.verifyIdToken(authToken)
      const account = await accountService.getAccountAndSelect({ user }, '_id')

      if (account) {
        return userService.generateAccessToken({ id: account._id, roles })
      }
      throw new AuthenticationError(errorMessages.accessDenied)
    }
  },
  Mutation: {
    revokeRefreshTokens: async (_: any, { account: id }: any) => {
      const account: any = await accountService.getAccountById(id)

      return userService.revokeRefreshTokens(account.user).then(() => ({
        success: true,
        message: i18n.t(statusMessages.account.tokenRevoked),
        code: 200,
        account
      }))
    },
    setRoles: async (_: any, { account: id, roles }: any, ctx: Context) => {
      const { accountLoader } = ctx.dataLoaders
      const account: any = await accountLoader.load(id)

      return userService.setRoles(account.user, ...roles).then(() => ({
        success: true,
        message: i18n.t(statusMessages.account.updated),
        code: 201,
        account
      }))
    }
  }
}
