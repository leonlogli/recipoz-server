import { DocTransformOptions, i18n } from '..'
import { isSupportedLanguage } from '../i18n'

/**
 * Base class that handles filter operators and basic 'path & value' extractor
 */
class FilterBase {
  /**
   * Filter meta operators that joins query clauses with 'or', 'and', 'nor' operators
   */
  static readonly metaOperators = ['and', 'nor', 'or'] as const

  static readonly operators = [
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

  constructor(protected options: DocTransformOptions) {}

  protected convertFilterValue = (op: FilterOperator, value: string) => {
    if (!op || !value) {
      return null
    }
    switch (op) {
      case 'gt':
      case 'gte':
      case 'lt':
      case 'lte':
      case 'size':
        return { [`$${op}`]: Number(value) }
      case 'mod':
        return { [`$${op}`]: value.split(',').map(v => Number(v.trim())) }
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

  protected formatIfI18nPath = (path: string) => {
    let _path = path
    const language: any = _path.split('.').pop()
    const isI18nFieldPath = this.i18nFields?.includes(language)

    if (isI18nFieldPath && !isSupportedLanguage(language)) {
      _path = `${_path}.${i18n.currentLanguage}`
    }

    return _path
  }

  protected extractFilterElements = (filter: string) => {
    let value
    let path = ''
    let operator: any
    let invertOp = false
    const filterParts = filter.split(':')

    if (filterParts.length === 2) {
      value = filterParts[1].trim()
      operator = filterParts[0].split('.').pop()
      invertOp = operator?.startsWith('!')

      operator = FilterBase.operators.find(
        op => (invertOp ? `!${op}` : op) === operator
      )

      if (operator) {
        path = filterParts[0].slice(0, -(operator.length + (invertOp ? 2 : 1)))
      } else if (!invertOp) {
        operator = 'eq'
        path = filterParts[0]
      }

      value = this.convertFilterValue(operator as any, value)
      if (invertOp && value) {
        value = { $not: value }
      }
    }

    return { operator, value, path: this.formatIfI18nPath(path) }
  }

  get refDocs() {
    return this.options.refDocs
  }

  get i18nFields() {
    return this.options.i18nFields
  }
}

export type FilterOperator = typeof FilterBase.operators[number]
export type FilterMetaOperator = typeof FilterBase.metaOperators[number]
export { FilterBase }
export default FilterBase
