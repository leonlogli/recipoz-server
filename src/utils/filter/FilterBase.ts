import { DocTransformOptions, i18n, supportedLanguages } from '..'

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

  protected convertFilterValue = (filter: FilterOperator, value: string) => {
    switch (filter) {
      case 'gt':
      case 'gte':
      case 'lt':
      case 'lte':
      case 'size':
        return { [`$${filter}`]: Number(value) }
      case 'mod':
        return { [`$${filter}`]: value.split(',').map(v => Number(v.trim())) }
      case 'in':
      case 'all':
      case 'nin':
        return { [`$${filter}`]: value.split(',') }
      case 'exists':
        return { [`$${filter}`]: value === 'true' }
      case 'eq':
      case 'ne':
        return { [`$${filter}`]: value }
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
    const pathLastElement: any = _path.split('.').pop()
    const isI18nFieldPath = this.i18nFields.includes(pathLastElement)

    if (isI18nFieldPath) {
      if (!supportedLanguages.some(lang => pathLastElement === lang)) {
        _path = `${_path}.${i18n.currentLanguage}`
      }
    }

    return _path
  }

  protected extractFilterElements = (filter: string) => {
    let value
    let path = ''
    let invertFilterExp
    const filterOperator = FilterBase.operators.find(exp =>
      filter.includes(`${exp}:`)
    )
    let usedFilterIndex = filter.indexOf(`.${filterOperator}:`)

    if (usedFilterIndex === -1) {
      usedFilterIndex = filter.indexOf(`.!${filterOperator}:`)
      invertFilterExp = true
    }

    if (filterOperator && usedFilterIndex !== -1) {
      path = filter.substring(0, usedFilterIndex)
      value = path && filter.substring(filter.indexOf(':') + 1, filter.length)
      value = this.convertFilterValue(filterOperator, value)
      if (invertFilterExp) {
        value = { $not: value }
      }
    }
    path = this.formatIfI18nPath(path)

    return { filterOperator, path, value }
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
