import mongoose from 'mongoose'

import { stopWords } from '../../resources'
import { SupportedLanguage } from '../i18n'

const { ObjectId } = mongoose.Types

/** Offset based Page options */
export interface OffsetPage {
  /** Page number (1 indexed, defaults to 1) */
  number: number
  /** Page size. Default: 20 */
  size: number
}

/**
 * Creates an ObjectId from the specified datetime value
 * @param value datetime value or timestamp in milliseconds
 */
const objectIdFromDateTime = (value: Date | string | number) => {
  const time = new Date(value).getTime() / 1000

  return ObjectId.createFromTime(time)
}

const removeStopwords = (text: string, language: SupportedLanguage) => {
  const stopwords = stopWords[language] || stopWords.en

  const words = text
    .split(' ')
    .map(w => w.toLowerCase())
    // eslint-disable-next-line no-restricted-globals
    .filter(w => isNaN(w as any) && w.length > 1)
    .filter(w => !stopwords.includes(w))

  return [...new Set(words)].join(' ')
}

const toObjectId = (value: any) => ObjectId(value)

const isValidObjectId = (id: any) => {
  if (!ObjectId.isValid(id)) {
    return false
  }

  return new ObjectId(id).toString() === String(id)
}

const isDuplicateError = (error: any) => {
  return error.name === 'MongoError' && error.code === 11000
}

export {
  toObjectId,
  removeStopwords,
  objectIdFromDateTime,
  isValidObjectId,
  isDuplicateError
}
