import dotObject from 'dot-object'

import { toLocale } from '.'
import { supportedLanguages, i18n } from './i18n'

/**
 * Abstract interface for pagination information.
 */
export interface Pageable {
  /** page number (1 indexed, defaults to 1) */
  page?: number
  /** page size. Default: 20 */
  limit?: number
  /** sort directives */
  sort?: string
  /**
   * Indicates whether the result must be paged or not. If the page or
   * limit is set, the result will be paged whatever the value of this option
   */
  paginate?: boolean
}

/**
 * Convert object to dotted-key/value pair
 * @param object object to convert
 */
function dotify<T>(object: T): T {
  const { dot } = dotObject

  return dot(object)
}

/**
 * Transforms the specified document by resolving (nested) _id (for lean document)
 * and using the current locale
 *
 * @param doc document to transform
 * @param lean indicates whether the specified document is lean or not
 * @param i18nFields i18n fields
 */
function transformDoc<T>(doc: T, lean?: boolean, ...i18nFields: string[]): T {
  const { _id, ...otherFields } = doc as any
  const result: any = {}

  if (i18nFields) {
    i18nFields.forEach(field => {
      result[field] = toLocale(otherFields[field])
    })
  }

  return {
    ...(lean && { id: _id }),
    ...otherFields,
    ...result
  }
}

/**
 * Append supported local on every i18n sort field. Ex: 'name' became 'name.fr name.en'
 * @param sort sort directives
 * @param i18nFields i18n fields
 */
const transformSortDirectives = (sort?: string, ...i18nFields: string[]) => {
  if (!i18nFields || !i18nFields.length || !sort) {
    return sort
  }

  return sort
    .split(' ')
    .map(item => {
      if (i18nFields.includes(item)) {
        return Array.from(supportedLanguages)
          .sort((a, _b) => (a === i18n.currentLanguage ? -1 : 0))
          .map(lang => `${item}.${lang}`)
          .join(' ')
      }

      return item
    })
    .join(' ')
}

function transformDocs<T>(
  docs: T[],
  lean?: boolean,
  ...i18nFields: string[]
): T[] {
  return docs.map(doc => transformDoc(doc, lean, ...i18nFields))
}

const isString = (val: any) => {
  return typeof val === 'string' || val instanceof String
}

export {
  dotify,
  transformDoc,
  transformDocs,
  transformSortDirectives,
  isString
}
