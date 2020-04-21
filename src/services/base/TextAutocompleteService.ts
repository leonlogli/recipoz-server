import { Model, Document } from 'mongoose'

import {
  dotify,
  appendLangsToFields,
  removeStopwords,
  detectLanguage
} from '../../utils'

export type TextAutocompleteServiceOptions = {
  model: Model<any>
  /** Path of the doc's main field ie the field with the highest index weight */
  autocompleteField?: string
  i18nFields?: string[]
}

/**
 * Handle autocomplete text search
 */
class TextAutocompleteService {
  autocompleteFields: string[]

  constructor(protected options: TextAutocompleteServiceOptions) {
    const { autocompleteField } = this.options

    this.autocompleteFields = this.formatAutocompleteField(autocompleteField)
  }

  private saveNewAutocompleteTags = async (doc: Document) => {
    const tags = this.extractAutoCompleteTags(doc)

    if (tags.trim()) {
      const _tags = tags.split(' ')
      const query = { _id: doc._id, _tags: { $nin: _tags } }

      this.model.findOneAndUpdate(query, { $push: { _tags } }).exec()
    }
  }

  private updateTags = async (doc: any) => {
    const tagStr = this.extractAutoCompleteTags(doc)
    const tags = tagStr.split(' ')

    this.model.findByIdAndUpdate(doc._id, { $set: { _tags: [] } }).exec(() => {
      this.refreshTags([...new Set([...tags, ...(doc._tags || [])])])
    })
  }

  private refreshTags = async (tags: string[]) => {
    const promises = tags
      .filter(t => t.trim())
      .map(async tag => {
        const query = { $text: { $search: tag }, _tags: { $nin: tag } }
        const cond = { $push: { _tags: tag } }

        return this.model.updateOne(query, cond).exec()
      })

    return Promise.all(promises)
  }

  private formatAutocompleteField(field?: string) {
    if (!field) {
      return []
    }
    if (this.options.i18nFields?.find(f => f.startsWith(field))) {
      return appendLangsToFields(field)
    }

    return [field]
  }

  private extractAutoCompleteTags = (data: any) => {
    const tags: string[] = []
    // Avoid maximum call stack size exceeded error in case the given data is a mongodb doc
    const obj = dotify(JSON.parse(JSON.stringify(data)))

    this.autocompleteFields.forEach(field => {
      const text = obj[field]

      if (text) {
        if (this.options.i18nFields?.includes(field)) {
          tags.push(removeStopwords(text, field.split('.').pop()))
        } else {
          tags.push(removeStopwords(text, detectLanguage(text)))
        }
      }
    })

    return tags.join(' ')
  }

  get model() {
    return this.options.model
  }

  /**
   * Start the autocomplete service, save or update autocomplete tags according
   * to the specified parameters
   * @param document the mongoose document to process
   * @param input input to update. if specified, the service checks is it has
   * autocomplete field, then update the autocomplete tags accordingly.
   * Specify it only in case of doc updates
   * @param refresh Indicates whether to refresh autocomplete tags or not.
   * Specify it only in case of doc delete
   */
  async start(doc: Document, input?: Record<string, any>, refresh = false) {
    const document: any = { ...doc }

    // In case of new doc create
    if (!input) {
      return this.saveNewAutocompleteTags(document)
    }
    // In case of delete
    if (refresh && document._tags && document._tags.length > 0) {
      this.refreshTags(document._tags)
    }
    // In case of update
    const hasAutocompleteField = Object.keys({ ...input.$set }).some(k =>
      this.autocompleteFields.includes(k)
    )

    if (hasAutocompleteField) {
      this.updateTags(document)
    }
  }

  /**
   * Refresh autocomplete tags after batch mutations
   * @param mutatedDocs mutated docs
   */
  async refresh(mutatedDocs: string[]) {
    const query = { _id: { $in: mutatedDocs } }
    const docs = await this.model.find(query, '_tags').exec()
    const tags = docs.map(doc => doc._tags)

    if (tags.length > 0) {
      this.refreshTags(tags)
    }
  }
}

export { TextAutocompleteService }
export default TextAutocompleteService
