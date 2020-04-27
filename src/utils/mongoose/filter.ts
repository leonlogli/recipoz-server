import { dotify, toNestedObject } from '../Util'
import { toLocalIds, toLocalId } from '../globalIdHelper'

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

const isRegExPath = (path: string) => {
  return path.endsWith('$like') || path.endsWith('$sw') || path.endsWith('$ew')
}

const buildFilterValue = (
  path: string,
  oldValue: string,
  ...idFieldsMap: Record<string, string>[]
) => {
  const idField = path.split('.').slice(-2)[0]
  const globalIdPathMap = idFieldsMap.find(
    map => Object.keys(map).pop() === idField
  )

  if (globalIdPathMap) {
    const type = globalIdPathMap && Object.values(globalIdPathMap).pop()

    if (Array.isArray(oldValue)) {
      return toLocalIds(oldValue, type || '')
    }

    return toLocalId(oldValue, type || '').id
  }

  return oldValue
}

/**
 * Build a mongodb filter query from the specified parameters
 * @param filter filter expressions
 * @param idFieldsMap globalId (GUID) fields that need to be converted to ObjectID.
 * Must be in the form { 'field': 'type' }.
 * Ex: { 'author': 'Account' }
 */
const buildFilterQuery = (
  filter: Record<string, any>,
  ...idFieldsMap: Record<string, string>[]
) => {
  const filterObj = dotify(filter)

  Object.keys(filterObj).forEach(oldKey => {
    let newKey = formatFilterPathOperators(oldKey)
    let value = buildFilterValue(oldKey, filterObj[oldKey], ...idFieldsMap)

    if (isRegExPath(newKey)) {
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
