import mongoose from 'mongoose'

import { toLocale, hasOwnProperty, isString } from '.'

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
  refDocs?: Record<string, string>[]
  i18nFields: string[]
}

/**
 * Transforms the specified document and its referenced documents
 * by resolving (nested) _id and using the current locale
 * @param doc document to transform
 * @param options document transform options
 */
function transformDoc<T>(doc: any, options: DocTransformOptions): T {
  if (!doc) {
    return doc
  }

  const { i18nFields } = options
  const refDocs = options.refDocs ? Object.keys(options.refDocs) : []
  const { _id, ...otherFields } = doc
  const result: any = {}

  if (i18nFields) {
    i18nFields.forEach(field => {
      if (hasOwnProperty(doc, field)) {
        result[field] = toLocale(doc[field])
      }
    })
  }

  if (refDocs.some(i => hasOwnProperty(doc, i))) {
    refDocs.forEach(subdoc => {
      if (hasOwnProperty(doc, subdoc) && !isString(doc[subdoc])) {
        result[subdoc] = transformDoc(doc[subdoc], options)
      }
    })
  }

  return { id: _id, ...otherFields, ...result }
}

/**
 * Transforms the specified documents and their sudocuments
 * by resolving (nested) _id and using the current locale
 * @param doc document to transform
 * @param options document transform options
 */
function transformDocs<T>(docs: T[], options: DocTransformOptions): T[] {
  if (!docs) {
    return docs
  }
  const { i18nFields, refDocs: subDocs } = options

  return docs.map(doc => transformDoc(doc, { refDocs: subDocs, i18nFields }))
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
  findDocAndSelectOnlyIds
}
