import dotObject from 'dot-object'

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

export { dotify, toNestedObject, isString, hasOwnProperty }
