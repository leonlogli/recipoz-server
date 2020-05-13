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
  pageNumber: Joi.number()
    .integer()
    .positive()
    .default(1),
  pageSize: Joi.number()
    .integer()
    .positive()
    .default(DEFAULT_PAGE_SIZE)
    .max(MAX_PAGE_SIZE)
}).default({
  pageNumber: 1,
  pageSize: DEFAULT_PAGE_SIZE
})

const cursorQuerySchema = Joi.object({
  orderBy: Joi.string(),
  first: Joi.number()
    .integer()
    .positive()
    .max(MAX_PAGE_SIZE),
  after: Joi.string(),
  last: Joi.number()
    .integer()
    .positive()
    .max(MAX_PAGE_SIZE),
  before: Joi.string(),
  criteria: Joi.object()
    .unknown(true)
    .default({})
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
  const { pageNumber: number, pageSize: size } = value

  return { number, size } as OffsetPage
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
