import DataLoader from 'dataloader'

import { accountService } from '../../services'
import { dataByQueryLoaderOptions as options } from '../../utils'

const { getAccountsByBatch, getAccounts, countAccounts } = accountService

const accountLoader = () => new DataLoader(getAccounts)

const accountByQueryLoader = () => {
  return new DataLoader(getAccountsByBatch, options)
}

const accountCountLoader = () => {
  return new DataLoader(countAccounts, options)
}

export { accountLoader, accountByQueryLoader, accountCountLoader }
