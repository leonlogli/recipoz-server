import mongoose from 'mongoose'

import { stopWords } from '../../resources'
import { SupportedLanguage } from '../i18n'
import { isString } from '../Util'

const { ObjectId } = mongoose.Types

/** Offset based Page options */
export interface OffsetPage {
  /** Page number (1 indexed, defaults to 1) */
  number: number
  /** Page size. Default: 20 */
  size: number
}

/**
 * Creates an ObjectId from the specified date
 * @param date Date object or string input
 */
const objectIdFromDateTime = (date: Date | string) => {
  let timestamp: any = date

  if (isString(timestamp)) {
    timestamp = new Date(timestamp)
  }

  return ObjectId.createFromTime(timestamp / 1000)
}

const removeStopwords = (text: string, language?: string) => {
  const stopwords = stopWords[language as SupportedLanguage] || stopWords.en

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

const areValidObjectIds = (...ids: any[]) => {
  return ids.every(id => isValidObjectId(id))
}

const isDuplicateError = (error: any) => {
  return error.name === 'MongoError' && error.code === 11000
}

export {
  toObjectId,
  removeStopwords,
  objectIdFromDateTime,
  areValidObjectIds,
  isValidObjectId,
  isDuplicateError
}
