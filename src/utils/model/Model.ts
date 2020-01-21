import {
  sortDirectivesToObject,
  dotify,
  isString,
  QueryOptions,
  transformDoc,
  transformDocs,
  buildListDataResponse
} from '..'
import { logger, DEFAULT_PAGE_SIZE } from '../../config'
import ModelBase, { QueryFindOptions } from './ModelBase'
import { buildSortDirectives } from '../sortHelper'
import { Page } from '../docUtils'

class Model extends ModelBase {
  private buildFindArgs = (criteria: any, sort?: string, filter?: any) => {
    const isSearchText = criteria && isString(criteria)
    let projection
    let conditions = { ...criteria, ...filter }
    let options = {
      sort: { ...sortDirectivesToObject(sort) },
      populate: this.defaultPopulatePaths,
      lean: true
    }

    if (isSearchText) {
      const textScore = { score: { $meta: 'textScore' } }

      conditions = { $text: { $search: criteria }, ...filter }
      projection = textScore
      options = { ...options, sort: { ...options.sort, ...textScore } }
    }

    return { conditions, projection, options }
  }

  private findDocs = async (findArgs: QueryFindOptions, page: any) => {
    const { conditions, projection, options } = findArgs
    const query = this.model.find(conditions, projection, options)
    let count

    if (page) {
      query.limit(page.size).skip(page.size * (page.number - 1))
    }
    const data = transformDocs(await query.exec(), this.i18nFields)

    if (page && data.length) {
      count = await this.model.countDocuments(conditions).exec()
    }

    return { data, count }
  }

  private partialTextSearch = async (text: string, opts: QueryOptions) => {
    logger.info(`Begining ${this.modelName} partial text search...`)
    const { page, filter, sort } = opts
    const regex = new RegExp(text, 'i')
    const conditions = {
      $or: this.partialSearchFields.map(field => ({ [field]: regex })),
      ...filter
    }
    const options = { sort, lean: true }
    const { data, count } = await this.findDocs({ conditions, options }, page)

    return buildListDataResponse(data, count, page)
  }

  private buildQueryOptions = async (queryOpts: QueryOptions) => {
    if (!queryOpts) {
      return {}
    }
    const sort = buildSortDirectives(queryOpts.sort, ...this.i18nFields)
    let { page, filter } = queryOpts

    filter = filter && (await this.filterBuilder.build(filter))

    if (queryOpts.page) {
      const { number, size } = queryOpts.page

      page = {} as Page
      page.number = number && number > 1 ? number : 1
      page.size = size && size > 0 ? size : DEFAULT_PAGE_SIZE
    } else page = undefined

    return { sort, filter, page }
  }

  find = async (criteria: any, options: QueryOptions) => {
    const opts = await this.buildQueryOptions(options)
    const { page, filter, sort } = opts
    const findArgs = this.buildFindArgs(criteria, sort, filter)
    const { data, count } = await this.findDocs(findArgs, page)

    if (!data.length && criteria && isString(criteria)) {
      return this.partialTextSearch(criteria, opts)
    }

    return buildListDataResponse(data, count, page)
  }

  findById = async (id: any) => {
    const data = await this.model
      .findById(id, null, { populate: this.defaultPopulatePaths })
      .lean()
      .orFail(this.dataNotFound)
      .exec()

    return transformDoc(data, this.i18nFields)
  }

  findOne = async (criteria: any, filter: string[]) => {
    const filterExp = await this.filterBuilder.build(filter)
    const data = await this.model
      .findOne({ ...dotify(criteria), ...filterExp }, null, {
        populate: this.defaultPopulatePaths
      })
      .lean()
      .orFail(this.dataNotFound)
      .exec()

    return transformDoc(data, this.i18nFields)
  }
}

export { Model }
export default Model
