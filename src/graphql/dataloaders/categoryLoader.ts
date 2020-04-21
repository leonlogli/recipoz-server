import DataLoader from 'dataloader'

import { categoryService } from '../../services'
import { dataByQueryLoaderOptions as options } from '../../utils'

const { getCategoriesByBatch, getCategories, countCategories } = categoryService

const categoryLoader = () => new DataLoader(getCategories)

const categoryByQueryLoader = () => {
  return new DataLoader(getCategoriesByBatch, options)
}

const categoryCountLoader = () => {
  return new DataLoader(countCategories, options)
}

export { categoryLoader, categoryByQueryLoader, categoryCountLoader }
