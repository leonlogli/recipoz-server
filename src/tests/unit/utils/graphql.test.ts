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
  INVALID_ID_TOKEN
} from '../../../constants'
import { ApiError } from '../../../utils'

describe('utils > graphql', () => {
  it('should return empty connexion', () => {
    const conn = emptyConnection()

    expect(conn.edges).to.be.empty
    expect(conn.nodes).to.be.empty
    expect(conn.totalCount).to.equal(0)
    expect(conn.pageInfo).eql({ hasNextPage: false, hasPreviousPage: false })
  })

  it('should includes clientMutationId in response payload', async () => {
    const clientMutationId = 'uid'
    const payload = { title: 'value' }
    const res = await withClientMutationId(payload, { clientMutationId })

    expect(res).to.eql({ title: 'value', clientMutationId: 'uid' })
  })

  it('should includes clientMutationId in response promise payload', async () => {
    const clientMutationId = 'uid'
    const payload = Promise.resolve({ title: 'value' })
    const res = await withClientMutationId(payload, { clientMutationId })

    expect(res).to.eql({ title: 'value', clientMutationId: 'uid' })
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

  it('should return mutation failed response on firebase error', () => {
    const errorCodes = {
      EMAIL_ALREADY_EXISTS,
      PHONE_NUMBER_ALREADY_EXISTS,
      USER_NOT_FOUND,
      ID_TOKEN_EXPIRED,
      ID_TOKEN_REVOKED,
      INVALID_ID_TOKEN,
      UNKOWN: undefined
    }

    Object.values(errorCodes).forEach(code => {
      const res = handleFirebaseError({ code })

      expect(res).to.includes({ success: false })
      expect(res).to.haveOwnProperty('code')
    })
  })
})
