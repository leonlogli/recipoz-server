import dotObject from 'dot-object'
import { ApolloError } from 'apollo-server-express'

import { errorMessages } from '../constants'
import { i18n } from '.'
import { logger, PROD_ENV } from '../config'

/**
 * Convert object to dotted-key/value pair
 * @param object object to convert
 */
const dotify = (object?: any) => {
  if (!object) {
    return {}
  }

  return dotObject.dot(object)
}

/**
 * Converts an object with dotted-key/value pairs to it's expanded version
 * @param dotedObject object to convert
 */
const toNestedObject = (dotedObject?: Record<string, any>): any => {
  if (!dotedObject) {
    return {}
  }

  return dotObject.object(dotedObject)
}

const isString = (val: any) => {
  return typeof val === 'string' || val instanceof String
}

/**
 * Determines whether an object has a property with the specified name.
 * @param object object.
 * @param propertyKey A property name.
 */
const hasOwnProperty = (object: any, propertyKey: string) => {
  return Object.prototype.hasOwnProperty.call(object, propertyKey)
}

const removeUndefinedKeysFrom = (obj: any): any => {
  return Object.entries(obj)
    .map(([k, v]) => [
      k,
      v && typeof v === 'object' ? removeUndefinedKeysFrom(v) : v
    ])
    .reduce((a, [k, v]) => (v === undefined ? a : { ...a, [k]: v }), {})
}

const sendError = (e: { code: string; message?: string }) => {
  const { accessDenied, account, internalServerError } = errorMessages

  if (!e || !e.message) {
    return
  }

  switch (e.code) {
    case 'auth/email-already-exists':
      throw new ApolloError(i18n.t(account.emailAlreadyExists), e.code)
    case 'auth/phone-number-already-exists':
      throw new ApolloError(i18n.t(account.phoneNumberAlreadyExists), e.code)
    case 'auth/invalid-password':
      throw new ApolloError(i18n.t(account.invalidPassword), e.code)
    case 'auth/invalid-phone-number':
      throw new ApolloError(i18n.t(account.invalidPhoneNumber), e.code)
    case 'auth/invalid-display-name':
      throw new ApolloError(i18n.t(account.invalidDisplayName), e.code)
    case 'auth/invalid-photo-url':
      throw new ApolloError(i18n.t(account.invalidPhotoURL), e.code)
    case 'auth/user-not-found':
      throw new ApolloError(i18n.t(account.userNotFound, e.code))
    case 'auth/id-token-revoked':
    case 'auth/id-token-expired':
    case 'auth/invalid-id-token':
      throw new ApolloError(i18n.t(accessDenied), e.code)
    default:
      logger.error(e.message)
      throw new ApolloError(
        PROD_ENV ? i18n.t(internalServerError) : e.message,
        e.code
      )
  }
}

export {
  dotify,
  toNestedObject,
  isString,
  hasOwnProperty,
  removeUndefinedKeysFrom,
  sendError
}
