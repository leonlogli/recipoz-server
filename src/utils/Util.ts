import dotObject from 'dot-object'

/**
 * Convert object to dotted-key/value pair
 * @param object object to convert
 */
function dotify<T>(object?: T): T | undefined {
  const { dot } = dotObject

  if (!object) {
    return object
  }

  return dot(object)
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

export { dotify, isString, hasOwnProperty }
