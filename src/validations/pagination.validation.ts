import Joi from '@hapi/joi'

import {
  checkAndSendValidationErrors,
  buildCursorParams,
  CursorPagingQueryBase,
  OffsetPage
} from '../utils'
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../config'

const offsetPageSchema = Joi.object({
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

const cursorQueryOptionsSchema = Joi.object({
  orderBy: Joi.string(),
  first: Joi.number()
    .positive()
    .max(MAX_PAGE_SIZE),
  after: Joi.string(),
  last: Joi.number()
    .positive()
    .max(MAX_PAGE_SIZE),
  before: Joi.string()
})
  .without('first', 'before')
  .without('first', 'last')
  .without('after', 'last')
  .without('after', 'before')

const validateOffsetPage = (opts: Partial<OffsetPage>) => {
  const { error, value } = offsetPageSchema.validate(
    { ...opts },
    { abortEarly: false }
  )

  checkAndSendValidationErrors(error)

  return value as OffsetPage
}

const validateCursorQuery = (opts: CursorPagingQueryBase) => {
  const { error, value } = cursorQueryOptionsSchema.validate(
    { ...opts },
    { abortEarly: false }
  )

  checkAndSendValidationErrors(error)

  return buildCursorParams({ ...value, paginatedField: value.orderBy })
}

export { validateOffsetPage, validateCursorQuery }
