import { ApolloError } from 'apollo-server-express'
import status from 'http-status'
import { Model } from 'mongoose'

import {
  DocTransformOptions,
  dotify,
  i18n,
  QueryOptions,
  transformDoc,
  Filter,
  getRefPaths
} from '../utils'

export type ModelServiceBaseOptions = {
  model: Model<any>
  docTransformOptions: DocTransformOptions
  partialSearchFields: string[]
  errorMessages: {
    dataNotFound: string
    dataToUpdateNotFound?: string
    dataToDeleteNotFound?: string
  }
}

export type QueryFindOptions = {
  conditions: any
  projection?: any
  options?: any
  callback?: (err: any, res: any[]) => void
}

/**
 * Base model with basic mutation methods
 */
abstract class ModelServiceBase {
  protected filterBuilder: Filter

  constructor(protected options: ModelServiceBaseOptions) {
    this.filterBuilder = new Filter(this.docTransformOptions)
  }

  abstract async findById(id: any): Promise<any>

  abstract async findOne(criteria: any, filter: string[]): Promise<any>

  abstract async find(criteria: any, options: QueryOptions): Promise<any>

  create = async (category: any) => {
    const createdCategory = await this.model.create(category)

    if (this.populatePaths) {
      createdCategory.populate(this.populatePaths)
    }

    return transformDoc(await createdCategory.execPopulate(), this.i18nFields)
  }

  update = async (id: any, category: any) => {
    const query = this.model
      .findByIdAndUpdate(id, { $set: dotify(category) }, { new: true })
      .lean()
      .orFail(this.dataToUpdateNotFound)

    if (this.populatePaths) {
      query.populate(this.populatePaths)
    }

    return transformDoc(await query.exec(), this.i18nFields)
  }

  delete = async (id: any) => {
    const query = this.model
      .findByIdAndDelete(id)
      .lean()
      .orFail(this.dataToDeleteNotFound)

    if (this.populatePaths) {
      query.populate(this.populatePaths)
    }

    return transformDoc(await query.exec(), this.i18nFields)
  }

  get errorMessages() {
    return this.options.errorMessages
  }

  get populatePaths() {
    return getRefPaths(this.options.docTransformOptions)[0]
  }

  get docTransformOptions() {
    return this.options.docTransformOptions
  }

  get i18nFields() {
    return this.docTransformOptions.i18nFields
  }

  get refDocs() {
    return this.docTransformOptions.refDocs
  }

  get model() {
    return this.options.model
  }

  get partialSearchFields() {
    return this.options.partialSearchFields
  }

  get dataNotFound() {
    const { dataNotFound } = this.options.errorMessages

    return new ApolloError(i18n.t(dataNotFound), status['404_NAME'])
  }

  get dataToDeleteNotFound() {
    const { dataNotFound, dataToDeleteNotFound } = this.options.errorMessages

    return new ApolloError(
      i18n.t(dataToDeleteNotFound || dataNotFound),
      status['404_NAME']
    )
  }

  get dataToUpdateNotFound() {
    const { dataNotFound, dataToUpdateNotFound } = this.options.errorMessages

    return new ApolloError(
      i18n.t(dataToUpdateNotFound || dataNotFound),
      status['404_NAME']
    )
  }
}

export { ModelServiceBase }
export default ModelServiceBase