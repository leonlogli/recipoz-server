import Joi from '@hapi/joi'

import {
  checkAndSendValidationErrors,
  buildCursorParams,
  CursorPagingQueryBase,
  OffsetPage,
  CursorPagingQuery
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

const cursorQuerySchema = Joi.object({
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
  const { error, value } = cursorQuerySchema.validate(
    { ...opts },
    { abortEarly: false }
  )
  let cursorQuery

  try {
    cursorQuery = buildCursorParams({ ...value, paginatedField: value.orderBy })
  } catch (e) {
    if (!e.message?.includes('contains an invalid value')) {
      throw e
    }
    const path = e.message.split(' ')[0].slice(1, -1)
    const err: any = { ...error, details: error?.details || [] }

    err.details.push({ message: e.message, path: [path], type: 'any.invalid' })
    checkAndSendValidationErrors(err)
  }
  checkAndSendValidationErrors(error)

  return cursorQuery as CursorPagingQuery
}

export { validateOffsetPage, validateCursorQuery }
