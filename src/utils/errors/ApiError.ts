import { ApolloError } from 'apollo-server-express'

import { i18n } from '../i18n'
import { statusCodeName, StatusCode } from '../docUtils'

export class ApiError extends ApolloError {
  constructor(
    message: string,
    code?: StatusCode,
    properties?: Record<string, any>
  ) {
    if (code) {
      super(i18n.t(message), statusCodeName(code), properties)
    } else {
      super(i18n.t(message), undefined, properties)
    }
  }
}
