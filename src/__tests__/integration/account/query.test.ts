import { expect } from 'chai'

import { client } from '../setup.test'
import { insertAccounts } from './util'
import { GET_ACCOUNTS, ME } from './graph'

describe('Account graph', () => {
  let dbAccounts: any[] = []

  beforeEach(async () => {
    dbAccounts = await insertAccounts()
  })

  describe('Account fecth', () => {
    it('should throw authentication error if the current user is not admin', async () => {
      const account = dbAccounts[0]
      const ctx: any = { accountId: account._id, userRoles: ['USER'] }

      const res = await client.useQuery(GET_ACCOUNTS, undefined, ctx)

      expect(res.data).to.equal(null)
      expect(res.errors[0].extensions.code).to.deep.include('FORBIDDEN')
    })

    it('should fetch the current user', async () => {
      const account = dbAccounts[0]
      const ctx: any = { accountId: account._id, userRoles: ['USER'] }

      const res = await client.useQuery(ME, undefined, ctx)
      const { me } = res.data

      expect(me).to.deep.include({ settings: { allergies: ['DAIRY'] } })
    })
  })
})
