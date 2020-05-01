import status, { HttpStatus } from 'http-status'
import { GraphQLError } from 'graphql'
import { ValidationError } from '@hapi/joi'
import { UserInputError } from 'apollo-server-express'

import { PROD_ENV, logger } from '../../config'
import { ApiError } from './ApiError'

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

  if (isInternalError) {
    logger.error('', error)

    return PROD_ENV ? new ApiError() : error
  }

  return error
}

export { formatError, checkAndSendValidationErrors, statusCodeName }
