import accounts from './accounts.json'
import { Account } from '../../../models'
import { client } from '../setup.test'
import { toObjectId } from '../../../utils'
import { GET_ACCOUNTS } from './graph'

const insertAccounts = async () => {
  return Account.insertMany(accounts)
}

const getDbAccounts = async () => {
  const ctx: any = {
    accountId: String(toObjectId(1)),
    userRoles: ['ADMIN', 'USER']
  }
  const res = await client.useQuery(GET_ACCOUNTS, undefined, ctx)

  return res.data.accounts.nodes
}

export { insertAccounts, getDbAccounts }
