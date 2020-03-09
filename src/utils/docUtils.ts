import status, { HttpStatus } from 'http-status'

import { i18n, SupportedLanguage } from './i18n'
import stopWords from '../constants/stopWords'
import { isString } from './Util'

/** Page query options */
export interface Page {
  /** Page number (1 indexed, defaults to 1) */
  number: number
  /** Page size. Default: 20 */
  size: number
}

export interface PageResponse extends Page {
  /** Total pages */
  count: number
}

export interface QueryOptions {
  /** sort directives */
  sort?: string
  /** filter conditions */
  filter?: string[]
  /** The language in which the query will be performed. If not specified, the current language is used */
  language: string
  /** Page info */
  page: Page
}

export type BatchQuery = Pick<QueryOptions, 'sort' | 'page'> & {
  /** query criteria */
  criteria: Record<string, any>
}

export type StatusCode = keyof Omit<HttpStatus, 'classes' | 'extra'>

/**
 * Convert sort directives to object.
 * Ex: sortDirectivesToObject('title -name') returns { title: 1, name: -1 }
 * @param sortDirectives sort directives. Ex: 'title -name'
 */
const convertSortToObject = (sortDirectives?: string) => {
  if (!sortDirectives) {
    return {}
  }
  const result: Record<string, any> = {}

  sortDirectives.split(' ').forEach(item => {
    if (item.startsWith('-')) {
      result[item.substring(1, item.length)] = -1
    } else result[item] = 1
  })

  return result
}

/**
 * Append the current language to every i18n sort field.
 * Ex: buildSortDirectives('name', ['name']) returns 'name.fr' if current language is 'fr'
 * @param sort sort query string
 * @param i18nFields i18n fields
 * @param toObject if true, return object. Otherwize, return string
 */
const buildSort = (sort?: string, i18nFields?: string[], toObject = false) => {
  if (!i18nFields || !i18nFields.length || !sort || !sort.trim()) {
    return toObject ? {} : sort
  }

  const res = sort
    .split(' ')
    .map(item => {
      if (i18nFields.find(field => item.includes(field))) {
        return `${item}.${i18n.currentLanguage}`
      }

      return item
    })
    .join(' ')

  return toObject ? convertSortToObject(res) : res
}

const buildFindQueryArgs = (opts: {
  query: any
  sort?: string
  filter?: any
  i18nFields?: string[]
  page: Page
}) => {
  const { query, sort, filter, i18nFields, page } = opts
  let projection
  let conditions
  const skip = page.size * (page.number - 1)
  let options: any = { lean: true, skip, limit: page.size }

  if (isString(query)) {
    const textScore = { score: { $meta: 'textScore' } }

    conditions = { $text: { $search: query }, ...filter }
    projection = textScore
    options = { ...options, sort: textScore }
  } else {
    conditions = { ...query, ...filter }
    options = { ...options, sort: buildSort(sort, i18nFields, true) }
  }

  return { conditions, projection, options }
}

const statusCodeName = (code: StatusCode): string => {
  const _code = code.endsWith('_NAME') ? code : `${code}_NAME`

  return (status as any)[_code]
}

const removeStopwords = (text: string, language?: string) => {
  const stopwords = stopWords[language as SupportedLanguage] || stopWords.en

  const words = text
    .split(' ')
    .map(w => w.toLowerCase())
    // eslint-disable-next-line no-restricted-globals
    .filter(w => isNaN(w as any) && w.length > 1)
    .filter(w => !stopwords.includes(w))

  return [...new Set(words)].join(' ')
}

const handleQueryRefKeys = (query: any, ...refKeys: string[]) => {
  if (!isString(query)) {
    const queryRefKeys = Object.keys(query).filter(key => refKeys.includes(key))

    queryRefKeys.forEach(key => {
      query[key] = { $in: query[key] }
    })
  }
}

export {
  buildSort,
  statusCodeName,
  removeStopwords,
  buildFindQueryArgs,
  handleQueryRefKeys
}
