import { Document } from 'mongoose'

import {
  ApiError,
  dotify,
  appendLangsToFields,
  DataLoaders,
  getDataLoaderByModel,
  updateDataLoaderCache,
  ModelName
} from '../../utils'
import TextAutocompleteService, {
  TextAutocompleteServiceOptions
} from './TextAutocompleteService'
import { errorMessages } from '../../constants'

export type ModelServiceBaseOptions = TextAutocompleteServiceOptions & {
  onNotFound?: string
}

/**
 * Base service that handles common model operations
 */
class ModelServiceBase<T extends Document> {
  i18nFields?: string[]

  autoCompleteService: TextAutocompleteService

  constructor(protected options: ModelServiceBaseOptions) {
    const { i18nFields, autocompleteField, onNotFound } = this.options

    this.i18nFields = i18nFields && appendLangsToFields(...i18nFields)
    this.options.onNotFound = onNotFound ?? errorMessages.notFound

    this.autoCompleteService = new TextAutocompleteService({
      model: this.model,
      i18nFields: this.i18nFields,
      autocompleteField
    })
  }

  protected singleWordAutocompleteSearch = async (query: string) => {
    const regex = new RegExp(`^${query}`)
    const docs = await this.model
      .find({ _tags: regex }, '_tags')
      .limit(10)
      .lean()
      .exec()
    const tags: string[] = []

    docs.forEach(doc => tags.push(...doc._tags))

    return tags.filter(tag => tag.match(regex))
  }

  create = async (data: any) => {
    const doc: T = await this.model.create(data)

    this.autoCompleteService.start(doc)

    return doc
  }

  createOrUpdate = async (query: object, input: object): Promise<T> => {
    const setDefaultsOnInsert = true
    const omitUndefined = true
    const opt = { upsert: true, new: true, setDefaultsOnInsert, omitUndefined }

    return this.model.findOneAndUpdate(query, input, opt).exec()
  }

  update = async (id: any, data: any, loaders?: DataLoaders) => {
    const set = { $set: dotify(data) }

    return this.updateOne({ _id: id }, set, loaders)
  }

  /**
   * Finds a matching document and updates it. The specified data can contains
   * any update operators ($set, $addToSet ...)
   */
  updateOne = async (query: object, input: object, loaders?: DataLoaders) => {
    const doc: any = await this.model
      .findOneAndUpdate(query, input, { new: true, omitUndefined: true })
      .lean()
      .orFail(this.notFoundError)
      .exec()

    if (loaders) {
      const loader = getDataLoaderByModel(this.modelName, loaders)

      if (loader) {
        updateDataLoaderCache(loader, doc)
      }
    }
    this.autoCompleteService.start(doc, input)

    return doc as T
  }

  deleteOne = async (query: any) => {
    const doc: any = await this.model
      .findOneAndDelete(query)
      .lean()
      .orFail(this.notFoundError)
      .exec()

    this.autoCompleteService.start(doc, undefined, true)
    if (!doc) {
      throw this.notFoundError
    }

    return doc as T
  }

  delete = (id: any) => this.deleteOne({ _id: id })

  get model() {
    return this.options.model
  }

  get modelName() {
    return this.options.model.modelName as ModelName
  }

  refreshAutoCompleteTags(mutatedDocs: string[]) {
    return this.autoCompleteService.refresh(mutatedDocs)
  }

  get notFoundError() {
    return new ApiError(this.options.onNotFound, '404')
  }
}

export { ModelServiceBase }
export default ModelServiceBase
