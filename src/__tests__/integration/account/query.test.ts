import { expect } from 'chai'

import { client } from '../setup.test'
import { insertAccounts } from './util'
import { GET_ACCOUNTS, ME } from './graph'

describe('Account graph', () => {
  let accounts: any[] = []

  beforeEach(async () => {
    accounts = await insertAccounts()
  })

  describe('Account fecth', () => {
    it('should throw access error if the current user is not admin', async () => {
      const account = accounts[0]
      const ctx: any = { accountId: account._id, userRoles: ['USER'] }

      const res = await client.useQuery(GET_ACCOUNTS, undefined, ctx)

      expect(res.data).to.equal(null)
      expect(res.errors[0].extensions.code).to.deep.include('FORBIDDEN')
    })

    it('should properly fetch accounts if the current user is admin', async () => {
      const account = accounts[0]
      const ctx: any = { accountId: account._id, userRoles: ['USER', 'ADMIN'] }

      const res = await client.useQuery(GET_ACCOUNTS, undefined, ctx)
      const { nodes, totalCount } = res.data.accounts

      expect(totalCount).to.equal(4)
      expect(nodes[0]).to.deep.include({ allergies: ['DAIRY'] })
      expect(nodes[3]).to.deep.include({ allergies: ['FISH'] })
    })

    it('should fetch the current user', async () => {
      const account = accounts[0]
      const ctx: any = { accountId: account._id, userRoles: ['USER'] }

      const res = await client.useQuery(ME, undefined, ctx)
      const { me } = res.data

      expect(me).to.deep.include({ allergies: ['DAIRY'] })
    })
  })
})
