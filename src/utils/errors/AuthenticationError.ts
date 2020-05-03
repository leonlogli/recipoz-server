import { AuthenticationError as AuthenticationErrorBase } from 'apollo-server-express'

import { i18n, locales } from '../i18n'

export class AuthenticationError extends AuthenticationErrorBase {
  constructor(message = i18n.t(locales.errorMessages.unauthenticated)) {
    super(i18n.t(message))
  }
}
