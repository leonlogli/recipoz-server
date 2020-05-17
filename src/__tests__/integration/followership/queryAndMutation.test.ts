import { expect } from 'chai'

import { ME, FOLLOW, UNFOLLOW } from './graph'
import { client } from '../setup.test'
import { getDbAccounts, insertAccounts } from '../account/util'

describe('Account followership graph', () => {
  let accounts: any[]

  beforeEach(async () => {
    accounts = await insertAccounts()
  })

  it('should properly follow account', async () => {
    const dbAccounts = await getDbAccounts()
    const input = { data: dbAccounts[1].id }
    const ctx: any = { accountId: accounts[0]._id, userRoles: ['USER'] }

    const res = await client.useMutation(FOLLOW, input, ctx)
    const { following, me } = res.data.follow

    expect(me).to.deep.include({ allergies: ['DAIRY'] })
    expect(following).to.deep.include({ allergies: ['EGG'] })
  })

  it('should properly unfollow account', async () => {
    const dbAccounts = await getDbAccounts()
    const input = { data: dbAccounts[1].id }
    const ctx: any = { accountId: accounts[0]._id, userRoles: ['USER'] }

    await client.useMutation(FOLLOW, input, ctx)
    const res = await client.useMutation(UNFOLLOW, input, ctx)
    const { following, me } = res.data.unfollow

    expect(me).to.deep.include({ allergies: ['DAIRY'] })
    expect(following).to.deep.include({ allergies: ['EGG'] })
  })

  it('should properly fetch account followers', async () => {
    const dbAccounts = await getDbAccounts()
    const input = { data: dbAccounts[0].id }
    const userRoles: any = ['USER']
    const ids = accounts.map(c => c._id)

    await Promise.all([
      client.useMutation(FOLLOW, input, { accountId: ids[1], userRoles }),
      client.useMutation(FOLLOW, input, { accountId: ids[2], userRoles }),
      client.useMutation(FOLLOW, input, { accountId: ids[3], userRoles })
    ])

    const ctx = { accountId: ids[0], userRoles }
    const { data } = await client.useQuery(ME, undefined, ctx)
    const { nodes } = data.me.followers

    expect(data.me.followers.totalCount).to.equal(3)
    expect(nodes[0]).to.deep.include({ allergies: ['EGG'] })
    expect(nodes[1]).to.deep.include({ allergies: ['GLUTEN'] })
    expect(nodes[2]).to.deep.include({ allergies: ['FISH'] })
  })

  it('should properly fetch account following', async () => {
    const dbAccounts = await getDbAccounts()
    const ctx: any = { accountId: accounts[0]._id, userRoles: ['USER'] }

    await Promise.all([
      client.useMutation(FOLLOW, { data: dbAccounts[1].id }, ctx),
      client.useMutation(FOLLOW, { data: dbAccounts[2].id }, ctx),
      client.useMutation(FOLLOW, { data: dbAccounts[3].id }, ctx)
    ])

    const res = await client.useQuery(ME, undefined, ctx)
    const { nodes } = res.data.me.following

    expect(res.data.me.following.totalCount).to.equal(3)
    expect(nodes[0]).to.deep.include({ allergies: ['EGG'] })
    expect(nodes[1]).to.deep.include({ allergies: ['GLUTEN'] })
    expect(nodes[2]).to.deep.include({ allergies: ['FISH'] })
  })

  it('should properly paging account following', async () => {
    const dbAccounts = await getDbAccounts()
    const ctx: any = { accountId: accounts[0]._id, userRoles: ['USER'] }

    await Promise.all([
      client.useMutation(FOLLOW, { data: dbAccounts[1].id }, ctx),
      client.useMutation(FOLLOW, { data: dbAccounts[2].id }, ctx),
      client.useMutation(FOLLOW, { data: dbAccounts[3].id }, ctx)
    ])

    const res = await client.useQuery(ME, { first: 2 }, ctx)
    const { nodes } = res.data.me.following

    expect(nodes).to.have.length(2)
    expect(nodes[0]).to.deep.include({ allergies: ['EGG'] })
    expect(nodes[1]).to.deep.include({ allergies: ['GLUTEN'] })
  })
})
