import Joi, { required } from '@hapi/joi'

import { supportedLanguages, isValidObjectId } from '../utils'

const objectIdSchema = Joi.custom((value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid')
  }

  return value
})

const languageSchema = Joi.string()
  .valid(...supportedLanguages)
  .required()

const idSchema = objectIdSchema.when('$isNew', { is: false, then: required() })

export { objectIdSchema, idSchema, languageSchema }
