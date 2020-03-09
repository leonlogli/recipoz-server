import { Document } from 'mongoose'

import {
  BatchQuery,
  buildSort,
  DataLoaders,
  hash,
  hasOwnProperties,
  QueryOptions,
  renameI18nKeys,
  i18n,
  buildFindQueryArgs
} from '../../utils'
import ModelServiceBase from './ModelServiceBase'

class ModelService<T extends Document> extends ModelServiceBase<T> {
  findById = async (id: any) => {
    const doc: T = await this.model
      .findById(id, null, { lean: true })
      .orFail(this.notFoundError)
      .exec()

    return doc
  }

  findByIds = async (ids: readonly any[]) => {
    const docs: T[] = await this.model
      .find({ _id: { $in: ids } }, null, { lean: true })
      .exec() // may return data in a different order than ids'

    // Returns the results in the same order as the supplied ids
    return ids.map(
      id =>
        docs.find(doc => doc._id.toString() === id.toString()) ||
        this.notFoundError
    )
  }

  buildQuery = (query: any) => {
    return this.i18nFields
      ? renameI18nKeys(query, i18n.currentLanguage, ...this.i18nFields)
      : []
  }

  findOne = async (query: any, selectFields?: any) => {
    return this.model.findOne(this.buildQuery(query), selectFields).exec()
  }

  findAndSelect = async (query: any, fields?: any, loaders?: DataLoaders) => {
    const conditions = this.buildQuery(query)
    const docs: T[] = await this.model.find(conditions, fields).exec()

    if (!fields) {
      this.primeDataLoader(loaders, ...docs)
    }

    return docs
  }

  find = async (query: any, opts: QueryOptions, loaders?: DataLoaders) => {
    const { sort, page, filter } = opts
    const { conditions, projection, options } = buildFindQueryArgs({
      query,
      sort,
      filter,
      page,
      i18nFields: this.i18nFields
    })
    const docsQuery = this.model.find(conditions, projection, options)
    let docs: T[]

    if (page.size && page.number) {
      docs = await docsQuery.exec()
    } else docs = await docsQuery.exec()

    this.primeDataLoader(loaders, ...docs)

    return { content: docs, query: { criteria: conditions, page } }
  }

  countByTextQueries = async (queries: readonly BatchQuery[]) => {
    const textQueries = queries.filter(query =>
      hasOwnProperties(query.criteria, '$text')
    )

    if (!textQueries.length) {
      return {}
    }
    const data = textQueries.map(query => [
      hash(query.criteria),
      this.model.countDocuments(query.criteria).exec()
    ])

    return Object.fromEntries(data)
  }

  countByBatch = async (queries: readonly BatchQuery[]) => {
    const _queries = queries
      .filter(query => !hasOwnProperties(query.criteria, '$text'))
      .map(query => [
        hash(query.criteria),
        [{ $match: query.criteria }, { $count: 'totalCount' }]
      ])

    const docs = await this.model
      .aggregate([{ $facet: Object.fromEntries(_queries) }])
      .exec()
    const data = docs[0]

    Object.keys(data).forEach(key => {
      data[key] = data[key][0]?.totalCount || 0
    })
    const res: Record<string, number> = {
      ...data,
      ...(await this.countByTextQueries(queries))
    }

    return queries.map(query => res[hash(query.criteria)])
  }

  /** Find docs by batch. Does not support $text query */
  batchFind = async (queries: readonly BatchQuery[], loaders?: DataLoaders) => {
    const _queries = queries.map(query => {
      const { page, criteria: $match, sort } = query
      const $skip = page.size * (page.number - 1)
      const $sort = buildSort(sort, this.i18nFields, true)
      const values: any[] = [{ $match }, { $skip }, { $limit: page.size }]

      if ($sort && Object.entries($sort).length) {
        values.splice(1, 0, { $sort })
      }

      return [hash(query), values]
    })

    const docs = await this.model
      .aggregate([{ $facet: Object.fromEntries(_queries) }])
      .exec()
    const data: Record<string, T[]> = docs[0]

    if (loaders) {
      Object.values(data).forEach(d => this.primeDataLoader(loaders, ...d))
    }

    return queries.map(query => data[hash(query)])
  }
}

export { ModelService }
export default ModelService
