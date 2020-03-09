import { AuthenticationError as AuthenticationErrorBase } from 'apollo-server-express'

import { errorMessages } from '../../constants'
import { i18n } from '../i18n'

export class AuthenticationError extends AuthenticationErrorBase {
  constructor(message = i18n.t(errorMessages.unauthenticated)) {
    super(i18n.t(message))
  }
}
