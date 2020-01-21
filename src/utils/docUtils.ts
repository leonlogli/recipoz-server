import mongoose from 'mongoose'

import { i18n } from '.'
import { dotify, toNestedObject } from './Util'
import { supportedLanguages } from './i18n'

/**
 * Abstract interface for pagination information.
 */
export interface Page {
  /** page number (1 indexed, defaults to 1) */
  number: number
  /** page size. Default: 20 */
  size: number
}

export interface QueryOptions {
  /** sort directives */
  sort?: string
  /** filter conditions */
  filter?: string[]
  /** Page info */
  page?: Page
}

export type DocTransformOptions = {
  /**
   * Referenced docs. Each refDoc must be in the form { 'pathFromOrigin': 'modelNames' }
   * Ex: { 'author/book' : 'Author/Book' } where 'Author' and 'Book' are model names that
   * match respectively each sub path 'auhor' and 'book'.
   * Subdoc paths that includes ref should be separated by point. Ex: { 'profile.userInfo' : 'UserInfo' }
   * where 'profile' is a subdoc with 'userInfo' field that refers to 'UserInfo' doc
   */
  refDocs?: Record<string, string>[]
  /**
   * i18n fields. Ex: ['title', 'name']
   */
  i18nFields: string[]
}

const getRefPaths = (options: DocTransformOptions) => {
  return options.refDocs?.map(refDoc => Object.keys(refDoc)[0]) || []
}

/**
 * Append each supported language to each field in the specified i18nFields
 * @param i18nFields i18n fields
 */
const formatI18NFieldsArg = (i18nFields: string[]) => {
  return i18nFields
    .map(i =>
      supportedLanguages
        .map(s => {
          return `${i}.${s}`
        })
        .join(';')
    )
    .join(';')
    .split(';')
}

/**
 * Transforms the specified document and its referenced documents
 * by resolving (nested) _id and using the current locale
 * @param doc document to transform
 * @param i18nFields i18n fields
 */
function transformDoc<T>(doc: any, i18nFields: string[]): T {
  if (!doc) {
    return doc
  }
  const dotedDoc = dotify(doc)
  const _i18nFields = formatI18NFieldsArg(i18nFields)

  if (_i18nFields) {
    _i18nFields.forEach(field => {
      const i18nKeys = Object.keys(dotedDoc).filter(k => k.endsWith(field))

      i18nKeys.forEach(i18nKey => {
        const keyWithoutLang = i18nKey
          .split('.')
          .slice(0, -1)
          .join('.')
        const matchedFields = i18nKeys.filter(key =>
          key.startsWith(keyWithoutLang)
        )
        const matchedField = matchedFields.find(
          key =>
            key.endsWith(i18n.currentLanguage) ||
            key.endsWith(i18n.currentLanguage.slice(0, 2))
        )

        if (matchedField) {
          dotedDoc[keyWithoutLang] = dotedDoc[matchedField]
        }
        matchedFields.forEach(key => delete dotedDoc[key])
      })
    })
  }

  const docIdKeys = Object.keys(dotedDoc).filter(key => key.endsWith('_id'))

  docIdKeys.forEach(k => {
    delete Object.assign(dotedDoc, { [`${k.slice(0, -3)}id`]: dotedDoc[k] })[k]
  })

  return toNestedObject(dotedDoc)
}

/**
 * Transforms the specified documents and their sudocuments
 * by resolving (nested) _id and using the current locale
 * @param doc document to transform
 * @param i18nFields i18n fields
 */
function transformDocs<T>(docs: T[], i18nFields: string[]): T[] {
  if (!docs) {
    return docs
  }

  return docs.map(doc => transformDoc(doc, i18nFields))
}

const buildListDataResponse = (content: any[], count = 0, page?: Page) => {
  if (!page) {
    return content
  }
  const pageCount = Math.ceil(count / page.size)

  return {
    content,
    page: {
      number: page.number,
      size: page.size,
      count: pageCount
    },
    totalElements: count
  }
}

const findDocAndSelectOnlyIds = async (criteria: any, modelName: string) => {
  return mongoose
    .model(modelName)
    .find(criteria, '_id', { lean: true })
    .exec()
}

export {
  transformDoc,
  transformDocs,
  buildListDataResponse,
  findDocAndSelectOnlyIds,
  getRefPaths
}
