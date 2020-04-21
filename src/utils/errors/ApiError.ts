import { ApolloError } from 'apollo-server-express'

import { i18n } from '../i18n'
import { statusCodeName, StatusCode } from './errorHelper'
import { errorMessages } from '../../constants'

export class ApiError extends ApolloError {
  constructor(
    message?: string,
    code?: StatusCode,
    properties?: Record<string, any>
  ) {
    const msg = i18n.t(message || errorMessages.internalServerError)

    if (code) {
      super(msg, statusCodeName(code), properties)
    } else {
      super(msg, undefined, properties)
    }
  }
}
