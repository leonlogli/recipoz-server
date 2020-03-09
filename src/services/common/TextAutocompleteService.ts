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

  checkIfTagsExist = async (tags: string[]) => {
    const queries = tags.map(tag => {
      const $project = { _id: 0, _tags: 1 }
      const conds = [{ $match: { _tags: tag } }, { $limit: 1 }, { $project }]

      return [tag, conds]
    })

    const docs = await this.model
      .aggregate([{ $facet: Object.fromEntries(queries) }])
      .exec()
    const data: Record<string, any[]> = docs[0]

    return tags.map(tag => ({ [tag]: data[tag].length > 0 }))
  }

  getNonExistingTags = async (tags: string[]) => {
    return this.checkIfTagsExist(tags).then(res => {
      return res.filter(t => !Object.values(t)[0]).map(t => Object.keys(t)[0])
    })
  }

  saveNewTags = async (doc: Document) => {
    const tagStr = this.extractAutoCompleteTags(doc)

    if (tagStr.trim()) {
      const tagsArray = tagStr.split(' ')
      const _tags = await this.getNonExistingTags(tagsArray)

      this.model.findByIdAndUpdate(doc._id, { $set: { _tags } }).exec()
    }
  }

  updateTags = async (doc: any) => {
    const tagStr = this.extractAutoCompleteTags(doc)
    const tags = tagStr.split(' ')

    this.model.findByIdAndUpdate(doc._id, { $set: { _tags: [] } }).exec(_ => {
      if (doc._tags) {
        tags.push(...doc._tags)
      }
      this.refreshTags([...new Set(tags)])
    })
  }

  refreshTags = async (tags: string[]) => {
    tags
      .filter(t => t.trim())
      .forEach(async tag => {
        const q = { $text: { $search: tag } }
        const opts = { lean: true, limit: 1 }

        const docs = await this.model.find(q, '_id', opts).exec()
        const cond = { $addToSet: { _tags: tag } }

        if (docs.length > 0) {
          this.model.findByIdAndUpdate(docs[0]._id, cond).exec()
        }
      })
  }

  get model() {
    return this.options.model
  }

  formatAutocompleteField(field?: string) {
    if (!field) {
      return []
    }
    if (this.options.i18nFields?.find(f => f.startsWith(field))) {
      return appendLangsToFields(field)
    }

    return [field]
  }

  extractAutoCompleteTags = (data: any) => {
    const tags: string[] = []
    // Maximum call stack size exceeded error in case the given data is a mongodb doc
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
}

export { TextAutocompleteService }
export default TextAutocompleteService
