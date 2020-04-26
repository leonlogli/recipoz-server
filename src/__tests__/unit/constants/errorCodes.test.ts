import { expect } from 'chai'

import * as errorCodes from '../../../constants/errorCodes'

describe('constants', () => {
  it('should return error codes', () => {
    const expected = {
      EMAIL_ALREADY_EXISTS: 'auth/email-already-exists',
      PHONE_NUMBER_ALREADY_EXISTS: 'auth/phone-number-already-exists',
      USER_NOT_FOUND: 'auth/user-not-found',
      ID_TOKEN_REVOKED: 'auth/id-token-revoked',
      ID_TOKEN_EXPIRED: 'auth/id-token-expired',
      INVALID_ID_TOKEN: 'auth/invalid-id-token',
      ARGUMENT_ERROR: 'auth/argument-error'
    }

    expect(errorCodes).to.eql(expected)
  })
})
