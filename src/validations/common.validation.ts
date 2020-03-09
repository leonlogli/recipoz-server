import Joi from '@hapi/joi'
import { supportedLanguages } from '../utils'

const { ObjectId } = require('mongoose').Types

const objectIdSchema = Joi.string().custom((value, helpers) => {
  if (!ObjectId.isValid(value)) {
    return helpers.error('any.invalid')
  }

  return value
})

const languageSchema = Joi.string()
  .valid(...supportedLanguages)
  .required()

export { objectIdSchema, languageSchema }
