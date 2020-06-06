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
 * @param date datetime value or timestamp in milliseconds
 */
const objectIdFromDate = (date: Date | string | number) => {
  const time = new Date(date).getTime() / 1000

  return ObjectId.createFromTime(time)
}

/**
 * Returns the generation date (accurate up to the second) that this ID was generated.
 * @param objectId objectId
 */
const objectIdToDate = (objectId: any) => {
  return ObjectId(objectId).getTimestamp()
}

const isValidObjectId = (id: any) => {
  if (!ObjectId.isValid(id)) {
    return false
  }

  return new ObjectId(id).toString() === String(id)
}

const toObjectId = (value: any) => ObjectId(value)

/**
 * Convert the specified value to object id or returns null when error occurs or invalid objectId.
 * @param value id value
 * @returns the objectId if valid id, null otherwise.
 */
const toSafeObjectId = (value: any) => {
  try {
    if (!isValidObjectId(value)) {
      return null
    }

    return toObjectId(value)
  } catch (e) {
    return null
  }
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

const isDuplicateError = (error: any) => {
  return error.name === 'MongoError' && error.code === 11000
}

export {
  objectIdToDate,
  toObjectId,
  toSafeObjectId,
  removeStopwords,
  objectIdFromDate,
  isValidObjectId,
  isDuplicateError
}
