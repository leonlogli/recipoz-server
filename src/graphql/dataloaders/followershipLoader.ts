import DataLoader from 'dataloader'

import { followershipService } from '../../services'
import { dataByQueryLoaderOptions as options } from '../../utils'

const {
  getAccountFollowersByBatch,
  countAccountFollowers
} = followershipService

const followershipByQueryLoader = () => {
  return new DataLoader(getAccountFollowersByBatch, options)
}

const followershipCountLoader = () => {
  return new DataLoader(countAccountFollowers, options)
}

export { followershipByQueryLoader, followershipCountLoader }
