import DataLoader from 'dataloader'

import { accountService } from '../../services'
import { dataByQueryLoaderOptions, dataCountLoaderOptions } from '../../utils'

const { getAccountsByBatch, getAccount, countAccountsByBatch } = accountService

const accountLoader = () => {
  return new DataLoader(getAccount)
}

const accountByQueryLoader = () => {
  return new DataLoader(getAccountsByBatch, dataByQueryLoaderOptions)
}

const accountCountLoader = () => {
  return new DataLoader(countAccountsByBatch, dataCountLoaderOptions)
}

export { accountLoader, accountByQueryLoader, accountCountLoader }
export default accountLoader
