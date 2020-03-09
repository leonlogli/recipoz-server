import DataLoader from 'dataloader'

import { categoryService } from '../../services'
import { dataByQueryLoaderOptions, dataCountLoaderOptions } from '../../utils'

const {
  getCategoriesByBatch,
  getCategory,
  countCategoriesByBatch
} = categoryService

const categoryLoader = () => {
  return new DataLoader(getCategory)
}

const categoryByQueryLoader = () => {
  return new DataLoader(getCategoriesByBatch, dataByQueryLoaderOptions)
}

const categoryCountLoader = () => {
  return new DataLoader(countCategoriesByBatch, dataCountLoaderOptions)
}

export { categoryLoader, categoryByQueryLoader, categoryCountLoader }
export default categoryLoader
