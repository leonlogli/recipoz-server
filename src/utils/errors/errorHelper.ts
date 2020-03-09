import { GraphQLError } from 'graphql'
import { ValidationError } from '@hapi/joi'

import {
  errorMessages,
  ID_TOKEN_EXPIRED,
  ID_TOKEN_REVOKED,
  ARGUMENT_ERROR,
  INVALID_ID_TOKEN,
  EMAIL_ALREADY_EXISTS,
  PHONE_NUMBER_ALREADY_EXISTS,
  USER_NOT_FOUND
} from '../../constants'
import { statusCodeName } from '../docUtils'
import { PROD_ENV, logger } from '../../config'
import { ApiError } from './ApiError'
import { UserInputError } from './UserInputError'
import { AuthenticationError } from './AuthenticationError'
import { ForbiddenError } from './ForbiddenError'

const buildErrorDetails = (error: GraphQLError) => {
  const { locations, path, extensions } = error
  const { exception } = extensions || {}

  return {
    locations,
    path,
    exception
  }
}

const formatFireBaseError = (error: GraphQLError) => {
  const exception = error.extensions?.exception
  const code = exception?.errorInfo.code
  const { accessDenied, account } = errorMessages
  const details = { ...buildErrorDetails(error) }

  switch (code) {
    case EMAIL_ALREADY_EXISTS:
      return new ApiError(account.emailAlreadyExists, '409', details)
    case PHONE_NUMBER_ALREADY_EXISTS:
      return new ApiError(account.phoneNumberAlreadyExists, '409', details)
    case USER_NOT_FOUND:
      return new ApiError(account.userNotFound, '404', details)
    case ID_TOKEN_EXPIRED:
    case ID_TOKEN_REVOKED:
    case INVALID_ID_TOKEN:
    case ARGUMENT_ERROR:
      return new ApiError(accessDenied, '401', details)
    default:
      return new ApiError(error.message, code, details)
  }
}

const checkAndSendValidationErrors = (
  error?: ValidationError,
  message?: string
) => {
  if (error) {
    const validationErrors = error.details.map(detail => ({
      message: detail.message,
      path: detail.path,
      type: detail.type
    }))
    const msg = message || validationErrors[0].message

    throw new UserInputError(msg, { validationErrors })
  }
}

/**
 * Runs on each error passed back to the client and format
 * some internal error message before sending them to the client
 * @param error graphql error
 */
const formatError = (error: GraphQLError) => {
  const { extensions } = error
  const exception = extensions?.exception
  const code = error.extensions?.code
  const { internalServerError, invalidId } = errorMessages

  if (exception?.codePrefix === 'auth') {
    return formatFireBaseError(error)
  }

  if (code === statusCodeName('500')) {
    if (exception?.name === 'CastError' && exception?.kind === 'ObjectId') {
      return new UserInputError(invalidId, buildErrorDetails(error))
    }

    if (PROD_ENV) {
      return new ApiError(internalServerError, code, buildErrorDetails(error))
    }
  }

  return error
}

/**
 * Ensures that any lower-severity or predefined error (AuthenticationError, UserInputError, etc.)
 * that's thrown within a resolver is only reported to the client, and never sent to Apollo
 * Graph Manager. All other errors are transmitted to Graph Manager normally.
 * @param error graphql error
 */
const rewriteError = (error: GraphQLError) => {
  if (
    error instanceof AuthenticationError ||
    error instanceof ForbiddenError ||
    error instanceof UserInputError
  ) {
    return null // do not report error
  }

  logger.error(error)

  return error // report the error.
}

export {
  formatError,
  buildErrorDetails,
  checkAndSendValidationErrors,
  rewriteError
}
