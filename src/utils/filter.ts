import { i18n, isSupportedLanguage } from '.'
import { hasOwnProperties } from './Util'

/** Filter meta operators that joins query clauses with 'or', 'and', 'nor' operators */
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

const convertFilterValue = (op: FilterOperator, value: string) => {
  if (!op || !value) {
    return null
  }
  switch (op) {
    case 'gt':
    case 'gte':
    case 'lt':
    case 'lte':
    case 'size':
      return { [`$${op}`]: Number(value) || value }
    case 'mod':
      return { [`$${op}`]: value.split(',').map(v => Number(v)) }
    case 'in':
    case 'all':
    case 'nin':
      return { [`$${op}`]: value.split(',') }
    case 'exists':
      return { [`$${op}`]: value === 'true' }
    case 'eq':
    case 'ne':
      return { [`$${op}`]: value }
    case 'like':
      return { $regex: new RegExp(value, 'i') }
    case 'sw':
      return { $regex: new RegExp(`^${value}`, 'i') }
    case 'ew':
      return { $regex: new RegExp(`${value}$`, 'i') }
    default:
      return null
  }
}

const appendCurrentLang = (path: string, i18nFields?: string[]) => {
  let _path = path
  const language: any = _path.split('.').pop()
  const isI18nFieldPath = i18nFields?.includes(language)

  if (isI18nFieldPath && !isSupportedLanguage(language)) {
    _path = `${_path}.${i18n.currentLanguage}`
  }

  return _path
}

const extractFilterElements = (filter: string, i18nFields?: string[]) => {
  let value
  let path = ''
  let operator: any
  let invertOp = false
  const filterParts = filter.split(':')

  if (filterParts.length === 2) {
    value = filterParts[1].trim()
    operator = filterParts[0].split('.').pop()
    invertOp = operator?.startsWith('!')

    operator = operators.find(op => (invertOp ? `!${op}` : op) === operator)

    if (operator) {
      path = filterParts[0].slice(0, -(operator.length + (invertOp ? 2 : 1)))
    } else if (!invertOp) {
      operator = 'eq'
      path = filterParts[0]
    }

    value = convertFilterValue(operator as any, value)
    if (invertOp && value) {
      value = { $not: value }
    }
  }

  return { operator, value, path: appendCurrentLang(path, i18nFields) }
}

const addSingleFilterResult = (
  lastResult: Record<string, any>,
  filter: string,
  i18nFields?: string[]
) => {
  const { path, value } = extractFilterElements(filter, i18nFields)

  if (path && value) {
    if (hasOwnProperties(lastResult, path)) {
      lastResult[path] = { ...lastResult[path], ...value }
    } else lastResult[path] = value
  }
}

/**
 * Build filter query criteria
 * @param filterCriteria filter criteria
 * @param onEveryFilter callback that will be invoked on every single filter. Useful to override
 * the retrieved filter by returning another value. Ex: when a filter contains refernced doc path
 * @param i18nFields i18n Fields
 */
const buildFilter = async (
  filterCriteria: string[],
  onEveryFilter?: (filter: string) => Promise<string>,
  i18nFields?: string[]
) => {
  if (!filterCriteria || !filterCriteria.length) {
    return {}
  }
  const result: Record<string, any> = {}

  for (const filter of filterCriteria) {
    const metaOp = filterMetaOperators.find(op => filter.startsWith(op))

    if (metaOp) {
      const subFilters = filter.slice(metaOp.length + 2, -1).split(';')

      if (!result[`$${metaOp}`]) {
        result[`$${metaOp}`] = []
      }
      for (const subFilter of subFilters) {
        result[`$${metaOp}`].push(
          await buildFilter([subFilter], onEveryFilter, i18nFields)
        )
      }
    } else {
      const _filter = onEveryFilter ? await onEveryFilter(filter) : filter

      addSingleFilterResult(result, _filter, i18nFields)
    }
  }

  return result
}

export type FilterOperator = typeof operators[number]
export type FilterMetaOperator = typeof filterMetaOperators[number]
export { extractFilterElements, buildFilter }
