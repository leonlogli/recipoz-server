import dotObject from 'dot-object'
import stringify from 'fast-json-stable-stringify'
import { createHash } from 'crypto'

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
 * Determines whether an object has properties with the specified names.
 * @param object object.
 * @param propertyKey A property name.
 * @returns true if all the specified keys are the given object properties, false otherwise
 */
const hasOwnProperties = (
  object: Record<string, any>,
  ...propertyKeys: string[]
) => {
  if (!Object.keys({ ...object }).length) {
    return false
  }

  return propertyKeys.every(key =>
    Object.prototype.hasOwnProperty.call(object, key)
  )
}

const removeUndefinedKeysFrom = (obj: any): any => {
  return Object.entries(obj)
    .map(([k, v]) => [
      k,
      v && typeof v === 'object' ? removeUndefinedKeysFrom(v) : v
    ])
    .reduce((a, [k, v]) => (v === undefined ? a : { ...a, [k]: v }), {})
}

/**
 * Rename the specified keys in the given object and return it.
 * @param obj object in which the keys will renamed
 * @param keysMap map of old and new keys. { 'oldKey': 'newKey' }
 */
const renameKeys = (
  obj: Record<string, any>,
  ...keysMap: Record<string, string>[]
): any => {
  keysMap.forEach(keyMap => {
    const oldKey = Object.keys(keyMap)[0]
    const newKey = keyMap[oldKey]

    delete Object.assign(obj, { [newKey]: obj[oldKey] })[oldKey]
  })

  return obj
}

/**
 * Sums each properties values of the specified array of object
 * Ex:[{ a: 1, b: 5 }, { a: 2, b: 5 }] returns { a: 3, b: 10 }
 * @param values arrays of object
 */
const sumProperties = (values: Record<string, number>[]) => {
  const res = values.reduce((previousValue, currentValue) => {
    const map = Object.keys(values[0]).map(key => [
      key,
      previousValue[key] + currentValue[key]
    ])

    return Object.fromEntries(map)
  })

  return res
}

/**
 * Deterministic data hash to . This is not for crypto purpose.
 * @param data data to hash
 * @returns the same 'hex' digest for the same given input data
 */
const hash = (data: any) => {
  return createHash('md5')
    .update(stringify(data))
    .digest('hex')
}

/**
 * Concat values of the given array using the lowest item length in the array.
 * Ex: concatValues([["a1", "b1"], ["a2"]]) returns ["a1 a2"]
 */
const concatValues = (arrayTab: string[][]) => {
  const res = []
  const minLength = Math.min(...arrayTab.map(i => i.length))

  for (let i = 0; i < minLength; i++) {
    let value = ''

    for (let j = 0; j < arrayTab.length; j++) {
      value = `${value + arrayTab[j][i]} `
    }
    res.push(value.trim())
  }

  return res
}

export {
  dotify,
  toNestedObject,
  isString,
  removeUndefinedKeysFrom,
  hasOwnProperties,
  renameKeys,
  sumProperties,
  hash,
  concatValues
}
