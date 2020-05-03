import { ForbiddenError as ForbiddenErrorBase } from 'apollo-server-express'

import { i18n, locales } from '../i18n'

export class ForbiddenError extends ForbiddenErrorBase {
  constructor(message = i18n.t(locales.errorMessages.forbidden)) {
    super(i18n.t(message))
  }
}
