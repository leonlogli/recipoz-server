import DataLoader from 'dataloader'

import { accountService } from '../../services'
import { dataByQueryLoaderOptions as options, prime } from '../../utils'

const { getAccountsByBatch, getAccounts, countAccounts } = accountService

const accountLoader = () => new DataLoader(getAccounts)

type AccountLoader = ReturnType<typeof accountLoader>

const accountByQueryLoader = (loader: AccountLoader) => {
  return new DataLoader(async queries => {
    const res = await getAccountsByBatch(queries as any)

    for (const page of res) {
      prime(loader, ...page.nodes)
    }

    return res
  }, options)
}

const accountCountLoader = () => {
  return new DataLoader(countAccounts, options)
}

export { accountLoader, accountByQueryLoader, accountCountLoader }
