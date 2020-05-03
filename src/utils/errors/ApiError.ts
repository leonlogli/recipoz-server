import { ApolloError } from 'apollo-server-express'

import { i18n, locales } from '../i18n'
import { statusCodeName, StatusCode } from './errorHelper'

export class ApiError extends ApolloError {
  constructor(
    message?: string,
    code?: StatusCode,
    properties?: Record<string, any>
  ) {
    const { notFound, internalServerError: serverError } = locales.errorMessages
    const notFoundMsg = i18n.t(message || notFound)
    const msg = code === '404' ? notFoundMsg : i18n.t(message || serverError)

    super(msg, statusCodeName(code || '500'), properties)
  }
}
