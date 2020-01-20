/* eslint-disable max-lines */
import { supportedLanguages, i18n } from './i18n'
import { DocTransformOptions, findIds } from './docUtils'
import { hasOwnProperty } from './Util'

/**
 * Filter meta operators that joins query clauses with logical op 'or', 'and', 'nor'
 */
const filterOperators = ['and', 'nor', 'or']

const filterExpressions = [
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
]

type FilterExp = typeof filterExpressions[number]

const convertFilterValue = (filter: FilterExp, value: string) => {
  switch (filter) {
    case 'gt':
    case 'gte':
    case 'lt':
    case 'lte':
    case 'size':
      return { [`$${filter}`]: Number(value) || value }
    case 'mod':
      return { [`$${filter}`]: value.split(',').map(v => Number(v) || v) }
    case 'in':
    case 'all':
    case 'nin':
      return { [`$${filter}`]: value.split(',') }
    case 'exists':
      return { [`$${filter}`]: value === 'true' }
    case 'eq':
      return { [`$${filter}`]: value }
    case 'like':
      return { $regex: new RegExp(value, 'i') }
    case 'sw':
      return { $regex: new RegExp(`^${value}`, 'i') }
    case 'ew':
      return { $regex: new RegExp(`${value}$`, 'i') }
    default:
      return value
  }
}

const formatI18nPath = (path: string, i18nFields: string[]) => {
  let _path = path

  if (i18nFields.includes(_path)) {
    if (!supportedLanguages.some(lang => _path.split('.').pop() === lang)) {
      _path = `${_path}.${i18n.currentLanguage}`
    }
  }

  return _path
}

const extractFilter = (filter: string, i18nFields: string[]) => {
  let value
  let path = ''
  let invertFilterExp
  const filterExp = filterExpressions.find(exp => filter.includes(`${exp}:`))
  let usedFilterIndex = filter.indexOf(`.${filterExp}:`)

  if (usedFilterIndex === -1) {
    usedFilterIndex = filter.indexOf(`.!${filterExp}:`)
    invertFilterExp = true
  }

  if (filterExp && usedFilterIndex !== -1) {
    path = filter.substring(0, usedFilterIndex)
    value = path && filter.substring(filter.indexOf(':') + 1, filter.length)
    value = convertFilterValue(filterExp, value)
    if (invertFilterExp) {
      value = { $not: value }
    }
  }
  path = formatI18nPath(path, i18nFields)

  return { filterExp, path, value }
}

const mapModelNamesToFilterPaths = (
  refPath: string,
  refModelNames: string[],
  _filterPath: string
) => {
  let filterPath = _filterPath
  const modelNameToPathMaps = []
  const refPathArray = refPath.split('/')

  filterPath = filterPath.replace(`${refPathArray[0]}.`, '')

  for (let i = 0; i < refPathArray.length; ++i) {
    const path = refPathArray[i + 1]
    const refModelName = refModelNames[i]

    if (filterPath.startsWith(path)) {
      modelNameToPathMaps.push({ [refModelName]: path })
      filterPath = filterPath.replace(`${path}.`, '')
    } else {
      modelNameToPathMaps.push({ [refModelName]: filterPath })
      break
    }
  }

  return modelNameToPathMaps
}

const extractRefFilter = async (
  filterPath: string,
  filterValue: any,
  refDoc: Record<string, string>
) => {
  const refPath = Object.keys(refDoc)[0]
  const refModelNames = refDoc[refPath].split('/')
  const modelNameToPaths = mapModelNamesToFilterPaths(
    refPath,
    refModelNames,
    filterPath
  )
  let ids: any[] = []

  for (let i = modelNameToPaths.length; i--; ) {
    const modelName = Object.keys(modelNameToPaths[i])[0]
    const path = modelNameToPaths[i][modelName]
    const val = i === modelNameToPaths.length - 1 ? filterValue : { $in: ids }

    ids = await findIds({ [path]: val }, modelName)
  }

  return { path: refPath.split('/')[0], value: { $in: ids } }
}

const getFilterPathAndValue = async (
  filter: string,
  i18nFields: string[],
  refDocs?: Record<string, string>[]
) => {
  let { path, value } = extractFilter(filter, i18nFields)

  if (!path.includes('.')) {
    return { path, value }
  }
  const refDoc = refDocs?.find(ref =>
    Object.keys(ref)[0].startsWith(path.split('.')[0])
  )

  if (refDoc) {
    const { path: p, value: v } = await extractRefFilter(path, value, refDoc)

    path = p
    value = v
  }

  return { path, value }
}

const buildFilterQuery = async (
  filterCriteria: string[],
  opts: DocTransformOptions
) => {
  const { i18nFields, refDocs } = opts
  const result: any = {}

  for (const filter of filterCriteria) {
    const metaOp = filterOperators.find(op => filter.startsWith(op))

    if (metaOp) {
      const subFilters = filter.slice(metaOp.length + 2, -1).split(';')

      if (!result[`$${metaOp}`]) {
        result[`$${metaOp}`] = []
      }
      for (const subFilter of subFilters) {
        result[`$${metaOp}`].push(await buildFilterQuery([subFilter], opts))
      }
    } else {
      const pathVal = await getFilterPathAndValue(filter, i18nFields, refDocs)
      const { path, value } = pathVal

      if (path && value) {
        if (hasOwnProperty(result, path)) {
          result[path] = { ...result[path], ...(value as any) }
        } else result[path] = value
      }
    }
  }

  return result
}

export { buildFilterQuery }
