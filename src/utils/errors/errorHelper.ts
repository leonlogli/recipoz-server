import status, { HttpStatus } from 'http-status'
import { GraphQLError } from 'graphql'
import { ValidationError } from '@hapi/joi'
import { UserInputError } from 'apollo-server-express'

import { PROD_ENV, logger } from '../../config'
import { ApiError } from './ApiError'
import { AuthenticationError } from './AuthenticationError'
import { ForbiddenError } from './ForbiddenError'

export type StatusCode = keyof Omit<HttpStatus, 'classes' | 'extra'>

const statusCodeName = (code: StatusCode): string => {
  const _code = code.endsWith('_NAME') ? code : `${code}_NAME`

  return (status as any)[_code]
}

const checkAndSendValidationErrors = (error?: ValidationError) => {
  if (error) {
    const validationErrors = error.details.map(detail => ({
      message: detail.message,
      path: detail.path,
      type: detail.type
    }))

    throw new UserInputError('Invalid input', { validationErrors })
  }
}

/**
 * Runs on each error passed back to the client and format
 * internal errors message before sending them to the client
 * @param error graphql error
 */
const formatError = (error: GraphQLError) => {
  const code = error.extensions?.code
  const isInternalError = code === statusCodeName('500') || code === 500

  if (PROD_ENV && isInternalError) {
    return new ApiError()
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
    // do not report error
    return null
  }

  logger.error('', error)

  // report the error.
  return error
}

export {
  formatError,
  checkAndSendValidationErrors,
  rewriteError,
  statusCodeName
}
