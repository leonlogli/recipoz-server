import mongoose from 'mongoose'

import { i18n } from '.'
import { dotify, toNestedObject } from './Util'
import { supportedLanguages } from './i18n'
import { APP_DEFAULT_LANGUAGE } from '../config'

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

const extractI18nPathWithoutLang = (i18nField: string) => {
  return i18nField
    .split('.')
    .slice(0, -1)
    .join('.')
}

/**
 * Map all i18n paths in the given doc (dotedDoc) that math the specified i18n path.
 * Returns array of each mapping. Ex: [{ title: ['title.fr', 'title.en'] }]
 * @param path i18n field (whithout language)
 * @param dotedDoc doted document
 * @param i18nFields formatted i18n fields. Ex: ['title.fr', 'title.en']
 */
const mapDocI18nPaths = (path: string, dotedDoc: any, i18nFields: string[]) => {
  const groupedI18NFields = i18nFields.filter(i => i.startsWith(path))
  const docI18nPaths = Object.keys(dotedDoc).filter(p =>
    groupedI18NFields.some(f => p.endsWith(f))
  )
  const docI18nPathsWithoutLangs = Array.from(
    new Set(docI18nPaths.map(i => extractI18nPathWithoutLang(i)))
  )
  const pathMaps = docI18nPathsWithoutLangs.map(keyWithoutLang => {
    const matchedDocI18nKeys = docI18nPaths.filter(i =>
      i.startsWith(keyWithoutLang)
    )

    return { [keyWithoutLang]: matchedDocI18nKeys }
  })

  return pathMaps
}

/**
 * Replace i18n paths in the specified document (dotedDoc) with their suitable path (without language)
 * @param pathMap i18n path map. Ex: { title: ['title.fr', 'title.en'] }
 * @param dotedDoc doc in wich the i18n paths will be replaced
 */
const replaceI18Fields = (pathMap: Record<string, string[]>, dotedDoc: any) => {
  const _dotedDoc = dotedDoc
  const keyWithoutLang = Object.keys(pathMap)[0]
  const matchedFields = pathMap[keyWithoutLang]
  let matchedField = matchedFields.find(
    key =>
      key.endsWith(i18n.currentLanguage) ||
      key.endsWith(i18n.currentLanguage.slice(0, 2))
  )

  if (!matchedField) {
    matchedField =
      matchedFields.find(k => k.endsWith(APP_DEFAULT_LANGUAGE as any)) ||
      matchedFields[0]
  }

  _dotedDoc[keyWithoutLang] = _dotedDoc[matchedField]
  matchedFields.forEach(key => delete _dotedDoc[key])
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
  // Dotify doc directly leads to unexpected result because _id is BSON Object.
  // So we parse doc after stringifying it
  const dotedDoc = dotify(JSON.parse(JSON.stringify(doc)))
  const _i18nFields = formatI18NFieldsArg(i18nFields)

  if (i18nFields) {
    i18nFields.forEach(field => {
      const pathMaps = mapDocI18nPaths(field, dotedDoc, _i18nFields)

      pathMaps.forEach(pathMap => replaceI18Fields(pathMap, dotedDoc))
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
  if (!docs || !docs.length) {
    return docs
  }

  return docs.map(doc => transformDoc(doc, i18nFields))
}

const findDocAndSelectOnlyIds = async (criteria: any, modelName: string) => {
  return mongoose
    .model(modelName)
    .find(criteria, '_id', { lean: true })
    .exec()
}

export { transformDoc, transformDocs, findDocAndSelectOnlyIds, getRefPaths }
