import accounts from './accounts.json'
import { Account } from '../../../models'

const insertAccounts = async () => {
  return Account.insertMany(accounts)
}

export { insertAccounts }
