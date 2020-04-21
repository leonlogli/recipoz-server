import { dotify, toNestedObject, isEmpty } from '../Util'
import { fromGlobalId } from '../globalIdHelper'

/**
 * Filter meta operators that joins query clauses with 'or', 'and', 'nor' operators
 */
const filterMetaOperators = ['and', 'nor', 'or'] as const

const operators = [
  'exists',
  'gt',
  'gte',
  'lt',
  'lte',
  'all',
  'in',
  'nin',
  'ne',
  'eq',
  'like',
  'mod',
  'size',
  'sw', // starts with
  'ew' // ends with
] as const

const formatFilterPathOperators = (path: string) => {
  let pathStr = path

  filterMetaOperators.forEach(op => {
    pathStr = pathStr.replace(new RegExp(`${op}\\[`, 'g'), `$${op}[`)
  })
  const paths = pathStr.split('.')
  const filterOp = `.$${paths.pop()}`

  return paths.join('.') + filterOp
}

/**
 * Check if the given path contains any of the specified global id fields
 * @param path path to check
 * @param idFields global id fields
 */
const isGlobalIdPath = (path: string, ...idFields: string[]) => {
  const idField = path.split('.').slice(-2)[0]

  return idFields.includes(idField)
}

const buildRegexFilterValue = (regPath: string, value: any): any => {
  if (regPath.endsWith('$like')) {
    return new RegExp(value, 'i')
  }
  if (regPath.endsWith('$sw')) {
    return new RegExp(`^${value}`, 'i')
  }
  if (regPath.endsWith('$ew')) {
    return new RegExp(`${value}$`, 'i')
  }

  return value
}

/**
 * Build a mongodb filter query from the specified parameters
 * @param filter filter expressions
 * @param idFields globalId (GUID) fields that need to be converted to ObjectID
 */
const buildFilterQuery = (
  filter: Record<string, any>,
  ...idFields: string[]
) => {
  if (isEmpty(filter)) {
    return {}
  }
  const filterObj = dotify(filter)

  Object.keys(filterObj).forEach(oldKey => {
    let newKey = formatFilterPathOperators(oldKey)
    let value = isGlobalIdPath(oldKey, ...idFields)
      ? fromGlobalId(filterObj[oldKey]).id || null
      : filterObj[oldKey]

    if (
      newKey.endsWith('$like') ||
      newKey.endsWith('$sw') ||
      newKey.endsWith('$ew')
    ) {
      value = buildRegexFilterValue(newKey, value)
      const paths = newKey.split('.').slice(0, -1)

      newKey = `${paths.join('.')}.$regex`
    }

    delete Object.assign(filterObj, { [newKey]: value })[oldKey]
  })

  return toNestedObject(filterObj) as Record<string, any>
}

export type FilterOperator = typeof operators[number]
export type FilterMetaOperator = typeof filterMetaOperators[number]
export { buildFilterQuery }
export default buildFilterQuery
