import { Document } from 'mongoose'

import {
  ApiError,
  dotify,
  appendLangsToFields,
  DataLoaders,
  primeDataLoader,
  concatValues,
  getDataLoaderByModel,
  updateLoaderCache
} from '../../utils'
import TextAutocompleteService, {
  TextAutocompleteServiceOptions
} from './TextAutocompleteService'

export type ModelServiceBaseOptions = TextAutocompleteServiceOptions & {
  onNotFound: string
}

/**
 * Base service that handles common model operations
 */
class ModelServiceBase<T extends Document> {
  notFoundError: ApiError

  i18nFields?: string[]

  autoCompleteService: TextAutocompleteService

  constructor(protected options: ModelServiceBaseOptions) {
    const { i18nFields, autocompleteField, onNotFound } = this.options

    this.notFoundError = new ApiError(onNotFound, '404')
    this.i18nFields = i18nFields && appendLangsToFields(...i18nFields)
    this.autoCompleteService = new TextAutocompleteService({
      model: this.model,
      i18nFields: this.i18nFields,
      autocompleteField
    })
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

    this.autoCompleteService.saveNewTags(doc)

    return doc
  }

  update = async (id: any, data: any, loaders?: DataLoaders) => {
    const _data = dotify(data)
    const hasAutocompleteField = Object.keys(_data).some(k =>
      this.autoCompleteService.autocompleteFields.includes(k)
    )
    const doc: any = await this.updateOne({ _id: id }, { $set: _data }, loaders)

    if (hasAutocompleteField) {
      this.autoCompleteService.updateTags(doc)
    }

    return doc as T
  }

  /**
   * Finds a matching document and updates it. The specified data can contains
   * any update operators ($set, $addToSet ...)
   */
  updateOne = async (query: any, data: any, loaders?: DataLoaders) => {
    const doc: T = await this.model
      .findOneAndUpdate(query, data, { new: true })
      .lean()
      .orFail(this.notFoundError)
      .exec()

    if (loaders) {
      const loader = getDataLoaderByModel(this.model.modelName, loaders)

      if (loader) {
        updateLoaderCache(loader, doc)
      }
    }

    return doc
  }

  addDataToSet = (id: any, data: any) => {
    return this.updateOne({ _id: id }, { $addToSet: dotify(data) })
  }

  removeDataFromArray = (id: any, data: any) => {
    return this.updateOne({ _id: id }, { $pull: dotify(data) })
  }

  delete = async (id: any) => {
    const doc = await this.model
      .findByIdAndDelete(id)
      .lean()
      .orFail(this.notFoundError)
      .exec()

    if (doc._tags && doc._tags.length) {
      this.autoCompleteService.refreshTags(doc._tags)
    }

    return doc as T
  }

  get model() {
    return this.options.model
  }

  primeDataLoader = (dataLoaders?: DataLoaders, ...docs: T[]) => {
    if (dataLoaders) {
      primeDataLoader(dataLoaders, this.model.modelName, ...docs)
    }
  }
}

export { ModelServiceBase }
export default ModelServiceBase
