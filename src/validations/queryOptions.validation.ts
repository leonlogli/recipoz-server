import Joi from '@hapi/joi'

import { languageSchema } from './common.validation'
import { checkAndSendValidationErrors, QueryOptions, i18n } from '../utils'
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../config'

const criteriaOptionsSchema = Joi.object({
  language: languageSchema.optional().default(i18n.currentLanguage),
  filter: Joi.array().items(Joi.string()),
  sort: Joi.string(),
  page: Joi.object({
    number: Joi.number()
      .integer()
      .positive()
      .default(1),
    size: Joi.number()
      .positive()
      .default(DEFAULT_PAGE_SIZE)
      .max(MAX_PAGE_SIZE)
  }).default({
    number: 1,
    size: DEFAULT_PAGE_SIZE
  })
})

const validateQueryOptions = (criteriaOptions: Partial<QueryOptions>) => {
  const { error, value } = criteriaOptionsSchema.validate(
    { ...criteriaOptions },
    { abortEarly: false }
  )

  checkAndSendValidationErrors(error, 'Invalid criteria options')

  return value as QueryOptions
}

export { validateQueryOptions }
