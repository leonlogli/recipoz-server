import {
  sortDirectivesToObject,
  dotify,
  QueryOptions,
  transformDoc,
  transformDocs
} from '../utils'
import { DEFAULT_PAGE_SIZE } from '../config'
import ModelServiceBase, { QueryFindOptions } from './ModelServiceBase'
import { buildSortDirectives } from '../utils/sortHelper'
import { Page } from '../utils/docUtils'

class ModelService extends ModelServiceBase {
  private buildFindArgs = (criteria: any, sort?: string, filter?: any) => {
    const { searchText, searchType } = criteria || {}
    let projection
    let conditions = { ...dotify(criteria), ...filter }
    let options = {
      sort: { ...sortDirectivesToObject(sort) },
      populate: this.populatePaths,
      ...(Boolean(this.populatePaths) && { populate: this.populatePaths }),
      lean: true
    }

    if (searchText && searchText.trim()) {
      if (searchType === 'PARTIAL_TEXT') {
        const regex = new RegExp(searchText, 'i')

        conditions = {
          $or: this.partialSearchFields.map(field => ({ [field]: regex })),
          ...filter
        }
      } else {
        const textScore = { score: { $meta: 'textScore' } }

        conditions = { $text: { $search: searchText }, ...filter }
        projection = textScore
        options = { ...options, sort: { ...options.sort, ...textScore } }
      }
    } else if (searchType) {
      conditions = { _: [] } // build conditions to get empty docs
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

  findById = async (id: any) => {
    const data = await this.model
      .findById(id, null, {
        lean: true,
        ...(Boolean(this.populatePaths) && { populate: this.populatePaths })
      })
      .orFail(this.dataNotFound)
      .exec()

    return transformDoc(data, this.i18nFields)
  }

  findOne = async (criteria: any, filter: string[]) => {
    const filterExp = await this.filterBuilder.build(filter)
    const conditions = { ...dotify(criteria), ...filterExp }
    const options = {
      ...(Boolean(this.populatePaths) && { populate: this.populatePaths }),
      lean: true
    }

    if (!Object.entries(conditions).length) {
      throw this.dataNotFound
    }
    const data = await this.model
      .findOne(conditions, null, options)
      .orFail(this.dataNotFound)
      .exec()

    return transformDoc(data, this.i18nFields)
  }

  find = async (criteria: any, options: QueryOptions) => {
    const opts = await this.buildQueryOptions(options)
    const { page, filter, sort } = opts as any
    const findArgs = this.buildFindArgs(criteria, sort, filter)
    const { data, count } = await this.findDocs(findArgs, page)

    if (page && count) {
      page.count = Math.ceil(count / page.size)
    }

    return { content: data, page, totalElements: count }
  }
}

export { ModelService }
export default ModelService
