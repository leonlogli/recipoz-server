import { i18n } from './i18n'
import { logger } from '../config'
import {
  errorMessages,
  EMAIL_ALREADY_EXISTS,
  PHONE_NUMBER_ALREADY_EXISTS,
  USER_NOT_FOUND,
  ID_TOKEN_EXPIRED,
  ID_TOKEN_REVOKED,
  INVALID_ID_TOKEN
} from '../constants'

/**
 * Returns query empty connection response
 */
const emptyConnection = () => {
  const pageInfo = { hasNextPage: false, hasPreviousPage: false }

  return { nodes: [], totalCount: 0, edges: [], pageInfo }
}

/**
 * Append the input clientMutationId property to the given payload
 * @param payload the mutation payload
 * @param input the mutation input
 */
const withClientMutationId = async <T extends Promise<object> | object>(
  payload: T,
  input?: { clientMutationId?: string }
) => {
  const { clientMutationId } = input || {}

  return Promise.resolve(payload).then(res => ({ ...res, clientMutationId }))
}

/**
 * Returns mutation failed response
 * @param err global error thrown by a service
 * @param input the mutation input. used to append to the payload clientMutationId if specified
 */
const errorRes = (err: any, input?: { clientMutationId?: string }) => {
  const { clientMutationId } = input || {}
  let { message } = err

  if (err.extensions?.code === 'NOT_FOUND') {
    return { success: false, message, code: 404, clientMutationId }
  }
  message = i18n.t(errorMessages.internalServerError)
  logger.error('', err)

  return { success: false, message, code: 500, clientMutationId }
}

/**
 * Returns mutation failed response on firebase error thrown
 * @param error firebase error thrown by a service
 */
const handleFirebaseError = (error: any) => {
  const msg = errorMessages.account
  const { emailAlreadyExists, userNotFound, phoneNumberAlreadyExists } = msg
  const success = false

  if (error.code === EMAIL_ALREADY_EXISTS) {
    return { success, message: i18n.t(emailAlreadyExists), code: 409 }
  }
  if (error.code === PHONE_NUMBER_ALREADY_EXISTS) {
    return { success, message: i18n.t(phoneNumberAlreadyExists), code: 409 }
  }
  if (error.code === USER_NOT_FOUND) {
    return { success, message: i18n.t(userNotFound), code: 404 }
  }
  if (error.code === ID_TOKEN_EXPIRED) {
    return { success, message: 'ID token expired', code: ID_TOKEN_EXPIRED }
  }
  if (error.code === ID_TOKEN_REVOKED) {
    return { success, message: 'ID token revoked', code: ID_TOKEN_REVOKED }
  }
  if (error.code === INVALID_ID_TOKEN) {
    return { success, message: 'Invalid ID token', code: INVALID_ID_TOKEN }
  }

  return errorRes(error)
}

export { withClientMutationId, errorRes, emptyConnection, handleFirebaseError }
