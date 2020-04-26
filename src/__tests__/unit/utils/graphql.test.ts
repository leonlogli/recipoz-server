import { expect } from 'chai'
import {
  emptyConnection,
  errorRes,
  handleFirebaseError,
  withClientMutationId
} from '../../../utils/graphql'
import {
  EMAIL_ALREADY_EXISTS,
  PHONE_NUMBER_ALREADY_EXISTS,
  USER_NOT_FOUND,
  ID_TOKEN_EXPIRED,
  ID_TOKEN_REVOKED,
  INVALID_ID_TOKEN,
  ARGUMENT_ERROR
} from '../../../constants'
import { ApiError } from '../../../utils'

describe('Graphql response helper', () => {
  it('should return a relay-like empty connexion', () => {
    const pageInfo = { hasNextPage: false, hasPreviousPage: false }
    const expected = { nodes: [], totalCount: 0, edges: [], pageInfo }

    expect(emptyConnection()).to.eql(expected)
  })

  describe('should includes clientMutationId', () => {
    it('when in response payload is not a promise', async () => {
      const clientMutationId = 'uid'
      const payload = { title: 'value' }
      const res = await withClientMutationId(payload, { clientMutationId })

      expect(res).to.eql({ title: 'value', clientMutationId: 'uid' })
    })

    it('when the payload is a promise', async () => {
      const clientMutationId = 'uid'
      const payload = Promise.resolve({ title: 'value' })
      const res = await withClientMutationId(payload, { clientMutationId })

      expect(res).to.eql({ title: 'value', clientMutationId: 'uid' }).and
    })
  })

  it('should return mutation error response', () => {
    const message = 'user not found'
    const clientMutationId = undefined
    const res = errorRes(new ApiError(message, '404'))

    expect(res).to.eql({ success: false, code: 404, message, clientMutationId })
  })

  it('should includes clientMutationId in error response', () => {
    const res = errorRes(new ApiError(), { clientMutationId: 'uid' })

    expect(res).to.include({ clientMutationId: 'uid', code: 500 })
  })

  describe('Firebase error mutation response', () => {
    it('should return conflict error code when email already exists', () => {
      const res = handleFirebaseError({ code: EMAIL_ALREADY_EXISTS })

      expect(res).to.includes({ success: false, code: 409 })
    })

    it('should return conflict error code when phone number already exists', () => {
      const res = handleFirebaseError({ code: PHONE_NUMBER_ALREADY_EXISTS })

      expect(res).to.includes({ success: false, code: 409 })
    })

    it('should return 404 error code on user not found', () => {
      const res = handleFirebaseError({ code: USER_NOT_FOUND })

      expect(res).to.includes({ success: false, code: 404 })
    })

    it('should return the right error code on token expired', () => {
      const res = handleFirebaseError({ code: ID_TOKEN_EXPIRED })

      expect(res).to.includes({ success: false, code: ID_TOKEN_EXPIRED })
    })

    it('should return the right error code on invalid token', () => {
      const res = handleFirebaseError({ code: INVALID_ID_TOKEN })

      expect(res).to.includes({ success: false, code: INVALID_ID_TOKEN })
    })

    it('should return the right error code on token revoked', () => {
      const res = handleFirebaseError({ code: ID_TOKEN_REVOKED })

      expect(res).to.includes({ success: false, code: ID_TOKEN_REVOKED })
    })

    it('should return the 500 error code on other auth error', () => {
      const res = handleFirebaseError({ code: ARGUMENT_ERROR })

      expect(res).to.includes({ success: false, code: 500 })
    })
  })
})
