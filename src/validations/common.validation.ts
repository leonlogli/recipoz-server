import Joi from '@hapi/joi'

import { supportedLanguages, isValidObjectId } from '../utils'

const required = Joi.required()

const objectId = Joi.custom((value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid')
  }

  return value
})

const uri = Joi.custom((value, helpers) => {
  const url = String(value)
  const { error } = Joi.string()
    .uri()
    .validate(url)

  if (error) {
    return helpers.error('any.invalid')
  }

  return url
})

const language = Joi.string()
  .valid(...supportedLanguages)
  .required()

const id = objectId.when('$isNew', { is: false, then: required })

export { objectId, id, language, uri, required }
