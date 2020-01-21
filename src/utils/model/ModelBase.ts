import { ApolloError } from 'apollo-server-express'
import status from 'http-status'
import mongoose, { Model } from 'mongoose'

import {
  DocTransformOptions,
  dotify,
  i18n,
  QueryOptions,
  transformDoc,
  Filter
} from '..'

export type ModelBaseOptions = {
  modelName: string
  docTransformOptions: DocTransformOptions
  defaultPopulatePaths: any
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
abstract class ModelBase {
  protected model: Model<any>

  protected filterBuilder: Filter

  constructor(protected options: ModelBaseOptions) {
    this.model = mongoose.model(this.options.modelName)
    this.filterBuilder = new Filter(this.docTransformOptions)
  }

  abstract async findById(id: any): Promise<any>

  abstract async findOne(criteria: any, filter: string[]): Promise<any>

  abstract async find(criteria: any, options: QueryOptions): Promise<any>

  create = async (category: any) => {
    const createdCategory = await (await this.model.create(category))
      .populate(this.options.defaultPopulatePaths)
      .execPopulate()

    return transformDoc(createdCategory.toJSON(), this.i18nFields)
  }

  update = async (id: any, category: any) => {
    const updatededCategory = await this.model
      .findByIdAndUpdate(id, { $set: dotify(category) }, { new: true })
      .populate(this.options.defaultPopulatePaths)
      .lean()
      .orFail(this.dataToUpdateNotFound)
      .exec()

    return transformDoc(updatededCategory, this.i18nFields)
  }

  delete = async (id: any) => {
    const deletedCategory = await this.model
      .findByIdAndDelete(id)
      .populate(this.options.defaultPopulatePaths)
      .orFail(this.dataToDeleteNotFound)
      .exec()

    return deletedCategory
      ? transformDoc(deletedCategory.toJSON(), this.i18nFields)
      : null
  }

  get errorMessages() {
    return this.options.errorMessages
  }

  get defaultPopulatePaths() {
    return this.options.defaultPopulatePaths
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

  get modelName() {
    return this.options.modelName
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

export { ModelBase }
export default ModelBase
