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
  buildPopulatePaths
} from '../utils'

export type ModelServiceBaseOptions = {
  model: Model<any>
  docTransformOptions: DocTransformOptions
  partialSearchFields?: string[]
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

  protected populatePaths: any

  constructor(protected options: ModelServiceBaseOptions) {
    this.filterBuilder = new Filter(this.docTransformOptions)
    this.populatePaths = buildPopulatePaths(this.docTransformOptions)
  }

  abstract async findById(id: any): Promise<any>

  abstract async findOne(criteria: any, filter: string[]): Promise<any>

  abstract async find(criteria: any, options: QueryOptions): Promise<any>

  create = async (data: any) => {
    const query = await this.model.create(data)
    let doc

    if (this.populate) {
      query.populate(this.populatePaths)
      doc = await query.execPopulate()
    } else doc = await query.exec()

    return this.transform ? transformDoc(doc, this.i18nFields) : doc
  }

  update = async (id: any, data: any): Promise<any> => {
    return this.update({ _id: id }, { $set: dotify(data) })
  }

  /**
   * Finds a matching document and updates it. The specified data can contains
   * any update operators ($set, $addToSet ...)
   */
  updateOne = async (conditions: any, data: any, onFail?: Error) => {
    const query = this.model
      .findOneAndUpdate(conditions, data, { new: true })
      .lean()
      .orFail(onFail || this.dataToUpdateNotFound)

    if (this.populate) {
      query.populate(this.populatePaths)
    }
    const doc = await query.exec()

    return this.transform ? transformDoc(doc, this.i18nFields) : doc
  }

  delete = async (id: any) => {
    const query = this.model
      .findByIdAndDelete(id)
      .lean()
      .orFail(this.dataToDeleteNotFound)

    if (this.populate) {
      query.populate(this.populatePaths)
    }
    const doc = await query.exec()

    return this.transform ? transformDoc(doc, this.i18nFields) : doc
  }

  get errorMessages() {
    return this.options.errorMessages
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

  get populate() {
    return this.options.docTransformOptions.populate || true
  }

  get transform() {
    return this.options.docTransformOptions.transform || true
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
