import { errorMessages, statusMessages } from '../../constants'
import { accountService, userService } from '../../services'
import {
  i18n,
  AuthenticationError,
  handleFirebaseError,
  toLocalId,
  withClientMutationId
} from '../../utils'
import { Context } from '../context'
import { validateAccount } from '../../validations'

export default {
  Query: {
    accessToken: async (_: any, { idToken }: any) => {
      const { uid: user, roles } = await userService.verifyIdToken(idToken)
      const account = await accountService.getAccountAndSelect({ user }, '_id')

      if (!account) {
        throw new AuthenticationError(errorMessages.accessDenied)
      }

      return userService.generateAccessToken({ id: account._id, roles })
    }
  },
  Mutation: {
    revokeRefreshTokens: async (_: any, { input }: any, ctx: Context) => {
      const { id } = toLocalId(input.account, 'Account')
      const value = validateAccount({ id }, false)
      const { accountLoader } = ctx.dataLoaders
      const message = i18n.t(statusMessages.account.tokenRevoked)

      const payload = accountLoader
        .load(value.id)
        .then(async account => {
          try {
            await userService.revokeRefreshTokens(account.user)

            return { success: true, message, code: 200, account }
          } catch (e) {
            return handleFirebaseError(e)
          }
        })
        .catch(handleFirebaseError)

      return withClientMutationId(payload, input)
    },
    setRoles: async (_: any, { input }: any, ctx: Context) => {
      const { id } = toLocalId(input.account, 'Account')
      const value = validateAccount({ id }, false)
      const { accountLoader } = ctx.dataLoaders
      const message = i18n.t(statusMessages.account.updated)

      const payload = accountLoader
        .load(value.id)
        .then(async account => {
          try {
            await userService.setRoles(account.user, ...input.roles)

            return { success: true, message, code: 201, account }
          } catch (e) {
            return handleFirebaseError(e)
          }
        })
        .catch(handleFirebaseError)

      return withClientMutationId(payload, input)
    }
  }
}
