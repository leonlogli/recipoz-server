import { expect } from 'chai'
import { UserInputError } from 'apollo-server-express'

import {
  rewriteError,
  statusCodeName,
  formatError,
  ForbiddenError,
  AuthenticationError,
  checkAndSendValidationErrors,
  ApiError
} from '../../../../utils/errors'

describe('Error helper', () => {
  it('should not report low-security error to to Apollo Graph Manager', () => {
    expect(rewriteError(new AuthenticationError())).to.be.null
    expect(rewriteError(new ForbiddenError())).to.be.null
  })

  it('should report high-security error to to Apollo Graph Manager', () => {
    expect(rewriteError(new ApiError())).to.exist
  })

  it('should not format internal errors message in non production env', () => {
    const error = new ApiError('Function is not defined')

    expect(formatError(error)).to.eql(error)
  })

  it('should not throw UserInputError when there is no error', () => {
    expect(checkAndSendValidationErrors()).to.not.throw
  })

  it('should throw UserInputError when there is error validation error', () => {
    const error: any = { name: 'ValidationError', details: [] }

    expect(() => checkAndSendValidationErrors(error)).to.throw(
      UserInputError,
      'Invalid input'
    )
  })

  it('should return human readable status code', () => {
    expect(statusCodeName('500')).to.equal('INTERNAL_SERVER_ERROR')
    expect(statusCodeName('404')).to.equal('NOT_FOUND')
  })
})
