import { ForbiddenError as ForbiddenErrorBase } from 'apollo-server-express'

import { errorMessages } from '../../constants'
import { i18n } from '../i18n'

export class ForbiddenError extends ForbiddenErrorBase {
  constructor(message = i18n.t(errorMessages.forbidden)) {
    super(i18n.t(message))
  }
}
