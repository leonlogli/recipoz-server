import { Document } from 'mongoose'

import {
  DataLoaders,
  toBase64,
  isEmpty,
  concatValues,
  OffsetPage
} from '../../utils'
import ModelServiceBase from './ModelServiceBase'
import {
  buildCursorQuery,
  CursorPagingQuery,
  buildSortDirectives
} from '../../utils/mongoose/pagination'
import buildPagedResponse from '../../utils/mongoose/pagination/result'

class ModelService<T extends Document> extends ModelServiceBase<T> {
  findById = async (id: any): Promise<T> => {
    return this.model
      .findById(id, null, { lean: true })
      .orFail(this.notFoundError)
      .exec()
  }

  findByIds = async (ids: readonly any[]) => {
    const docs: T[] = await this.model
      .find({ _id: { $in: ids } }, null, { lean: true })
      .exec() // may return data in a different order than ids'

    // Returns the results in the same order as the supplied ids
    return ids.map(id => {
      const doc = docs.find(docum => docum._id.toString() === id.toString())

      return doc ? { ...doc, __typename: this.modelName } : this.notFoundError
    })
  }

  findOne = async (query: any, selectFields?: any): Promise<T | null> => {
    return this.model.findOne(query, selectFields).exec()
  }

  exists = (id: any) => {
    return this.findOne({ _id: id }, '_id')
      .then(res => !!res)
      .catch(() => false)
  }

  findAndSelect = async (query: any, fields?: any): Promise<T[]> => {
    return this.model.find(query, fields).exec()
  }

  autocompleteSearch = async (query: string) => {
    if (!query.trim()) {
      return []
    }
    const words = query.split(' ')

    if (words.length === 1) {
      return this.singleWordAutocompleteSearch(query)
    }
    const tagsArray = await Promise.all(
      words.map(w => this.singleWordAutocompleteSearch(w))
    )

    return concatValues(tagsArray)
  }

  search = async (
    query: string,
    page: OffsetPage,
    filter?: any,
    loaders?: DataLoaders
  ) => {
    const textScore = { score: { $meta: 'textScore' } }
    const conditions = { $text: { $search: query }, ...filter }
    const projection = textScore
    const skip = page.size * (page.number - 1)
    const opts = { lean: true, skip, limit: page.size, sort: textScore }

    const docs: T[] = await this.model.find(conditions, projection, opts).exec()
    const count = this.model.countDocuments(conditions).exec()

    this.primeDataLoader(loaders, ...docs)

    return { content: docs, count, query: { criteria: conditions, page } }
  }

  /**
   * Find docs by batch
   */
  batchFind = async (
    queries: readonly CursorPagingQuery[],
    loaders?: DataLoaders
  ) => {
    const _queries = queries.map(query => {
      const { criteria, limit } = query
      const cursorQuery = buildCursorQuery(query)
      const $match: any = isEmpty(criteria)
        ? cursorQuery
        : { $and: [cursorQuery, criteria] }
      const $sort = buildSortDirectives(query)
      const values = [{ $match }, { $sort }, { $limit: limit + 1 }]

      return [toBase64(query), values]
    })

    const docs = await this.model
      .aggregate([{ $facet: Object.fromEntries(_queries) }])
      .exec()
    const res: Record<string, T[]> = docs[0]

    if (loaders) {
      Object.values(res).forEach(d => this.primeDataLoader(loaders, ...d))
    }

    return queries.map(query => buildPagedResponse(res[toBase64(query)], query))
  }

  countByBatch = async (queries: readonly Record<string, any>[]) => {
    const _queries = queries.map(query => [
      toBase64(query),
      [{ $match: query }, { $count: 'totalCount' }]
    ])

    const docs = await this.model
      .aggregate([{ $facet: Object.fromEntries(_queries) }])
      .exec()
    const data = docs[0]

    Object.keys(data).forEach(key => {
      data[key] = data[key][0]?.totalCount || 0
    })
    const res: Record<string, number> = data

    return queries.map(query => res[toBase64(query)])
  }
}

export { ModelService }
export default ModelService
