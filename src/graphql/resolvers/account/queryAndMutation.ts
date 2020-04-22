import { Context } from '../..'
import { errorMessages } from '../../../constants'
import { accountService } from '../../../services'
import { i18n, toLocalId, withClientMutationId } from '../../../utils'
import {
  validateAccount,
  validateCursorQuery,
  validateUserRegister
} from '../../../validations'

const { forbidden } = errorMessages

export default {
  Query: {
    me: (_: any, __: any, { accountId, dataLoaders }: Required<Context>) => {
      return dataLoaders.accountLoader.load(accountId)
    },
    accounts: (_: any, args: any, ctx: Context) => {
      const cursorQuery = validateCursorQuery(args)
      const { accountByQueryLoader } = ctx.dataLoaders

      return accountByQueryLoader.load(cursorQuery)
    }
  },
  Mutation: {
    register: (_: any, { input }: any) => {
      const account = validateUserRegister(input)
      const payload = accountService.addAccountForNewUser(account)

      return withClientMutationId(payload, input)
    },
    addAccount: async (_: any, { input }: any) => {
      const payload = accountService.addAccountForExistingUser(input.idToken)

      return withClientMutationId(payload, input)
    },
    updateAccount: (_: any, { input }: any, { accountId }: Context) => {
      const data = validateAccount({ ...input, id: accountId })
      const payload = accountService.updateAccount(data)

      return withClientMutationId(payload, input)
    },
    addRegistrationToken: (_: any, { input }: any, { accountId }: Context) => {
      const { registrationToken: token } = input
      const payload = accountService.addRegistrationToken(accountId, token)

      return withClientMutationId(payload, input)
    },
    deleteAccount: (_: any, { input }: any, ctx: Required<Context>) => {
      const { isAdmin, accountId } = ctx
      let id = accountId

      if (input.id) {
        if (!isAdmin) {
          return { success: false, code: 403, message: i18n.t(forbidden) }
        }
        id = toLocalId(input.id, 'Account').id as any
      }
      const account = validateAccount({ id }, false)
      const payload = accountService.deleteAccount(account.id)

      return withClientMutationId(payload, input)
    }
  }
}
