import DataLoader from 'dataloader'

import { recipeSourceService } from '../../services'
import { dataByQueryLoaderOptions, dataCountLoaderOptions } from '../../utils'

const {
  getSourcesByBatch,
  getSource,
  countSourcesByBatch
} = recipeSourceService

const recipeSourceLoader = () => {
  return new DataLoader(getSource)
}

const recipeSourceByQueryLoader = () => {
  return new DataLoader(getSourcesByBatch, dataByQueryLoaderOptions)
}

const recipeSourceCountLoader = () => {
  return new DataLoader(countSourcesByBatch, dataCountLoaderOptions)
}

export {
  recipeSourceLoader,
  recipeSourceByQueryLoader,
  recipeSourceCountLoader
}
export default recipeSourceLoader
