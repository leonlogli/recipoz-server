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
 * Determines whether an object has properties with the specified names.
 * @param object object.
 * @param keys A property names.
 * @returns true if all the specified keys are the given object properties, false otherwise
 */
const hasOwnProperties = (object: Record<string, any>, ...keys: string[]) => {
  if (!Object.keys({ ...object }).length) {
    return false
  }

  return keys.every(key => Object.prototype.hasOwnProperty.call(object, key))
}

const removeUndefinedKeys = <T extends Record<string, any>>(obj: T): T => {
  return Object.entries(obj)
    .map(([k, v]) => [
      k,
      v && typeof v === 'object' ? removeUndefinedKeys(v) : v
    ])
    .reduce((a, [k, v]) => (v === undefined ? a : { ...a, [k]: v }), {} as T)
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

/**
 * Chunks (splits) the array into many smaller arrays with the specified length 'chunkSize'
 * @param array array to chunk
 * @param chunkSize maximum length of each chunked array
 */
const chunk = <T>(array: T[], chunkSize: number) => {
  const res = []

  for (let i = 0, l = array.length; i < l; i += chunkSize)
    res.push(array.slice(i, i + chunkSize))

  return res
}

const isEmpty = (obj: any) => {
  return (
    [Object, Array].includes((obj || {}).constructor) &&
    !Object.entries(obj || {}).length
  )
}

const hasDuplicates = (array: any[]) => {
  return new Set(array).size !== array.length
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
 * Return `true` if any property of the specified object has falsy value, `false` otherwise
 * @param obj object
 */
const hasFalsyValue = (obj: object) => Object.values(obj).some(v => !v)

export {
  isEmpty,
  chunk,
  dotify,
  toNestedObject,
  isString,
  removeUndefinedKeys,
  hasOwnProperties,
  concatValues,
  hasDuplicates,
  renameKeys,
  hasFalsyValue
}
