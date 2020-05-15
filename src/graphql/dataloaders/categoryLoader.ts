import DataLoader from 'dataloader'

import { categoryService } from '../../services'
import { dataByQueryLoaderOptions as options, prime } from '../../utils'

const { getCategoriesByBatch, getCategories, countCategories } = categoryService

const categoryLoader = () => new DataLoader(getCategories)

type CategoryLoader = ReturnType<typeof categoryLoader>

const categoryByQueryLoader = (loader: CategoryLoader) => {
  return new DataLoader(async queries => {
    const res = await getCategoriesByBatch(queries as any)

    for (const page of res) {
      prime(loader, ...page.nodes)
    }

    return res
  }, options)
}

const categoryCountLoader = () => {
  return new DataLoader(countCategories, options)
}

export { categoryLoader, categoryByQueryLoader, categoryCountLoader }
