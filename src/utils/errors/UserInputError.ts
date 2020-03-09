import { UserInputError as UserInputErrorBase } from 'apollo-server-express'
import { i18n } from '../i18n'

export class UserInputError extends UserInputErrorBase {
  constructor(message: string, properties?: Record<string, any>) {
    super(i18n.t(message), properties)
  }
}
