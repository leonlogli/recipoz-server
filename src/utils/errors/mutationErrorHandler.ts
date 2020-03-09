import { statusCodeName } from '../docUtils'
import {
  errorMessages,
  EMAIL_ALREADY_EXISTS,
  PHONE_NUMBER_ALREADY_EXISTS,
  USER_NOT_FOUND
} from '../../constants'
import { i18n } from '../i18n'

const { category, account } = errorMessages

const categoryMutationErrorHandler = (
  error: any,
  values: Record<string, any> = { category: null }
) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    const message = i18n.t(category.nameAlreadyExists)

    return { success: false, message, code: 409, ...values }
  }
  if (error.extensions?.code === statusCodeName('404')) {
    return { success: false, message: error.message, code: 404, ...values }
  }
  throw error
}

const accountMutationErrorHandler = (
  error: any,
  values: Record<string, any> = { acount: null }
) => {
  if (error.extensions?.code === EMAIL_ALREADY_EXISTS) {
    const message = i18n.t(account.emailAlreadyExists)

    return { success: false, message, code: 409, ...values }
  }
  if (error.extensions?.code === PHONE_NUMBER_ALREADY_EXISTS) {
    const message = i18n.t(account.phoneNumberAlreadyExists)

    return { success: false, message, code: 409, ...values }
  }
  if (error.extensions?.code === USER_NOT_FOUND) {
    const message = i18n.t(account.userNotFound)

    return { success: false, message, code: 404, ...values }
  }
  if (error.extensions?.code === statusCodeName('404')) {
    return { success: false, message: error.message, code: 404, ...values }
  }
  throw error
}

const recipeSourceMutationErrorHandler = (
  error: any,
  values: Record<string, any> = { recipeSource: null }
) => {
  if (error.extensions?.code === statusCodeName('404')) {
    return { success: false, message: error.message, code: 404, ...values }
  }
  throw error
}

export {
  categoryMutationErrorHandler,
  accountMutationErrorHandler,
  recipeSourceMutationErrorHandler
}
