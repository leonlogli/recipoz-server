import DataLoader from 'dataloader'

import { recipeCollectionService } from '../../services'
import { dataByQueryLoaderOptions as options, prime } from '../../utils'

const {
  getRecipeCollectionsByBatch,
  getRecipeCollections,
  countRecipeCollections
} = recipeCollectionService

const recipeCollectionLoader = () => new DataLoader(getRecipeCollections)

type RecipeCollectionLoader = ReturnType<typeof recipeCollectionLoader>

const recipeCollectionByQueryLoader = (loader: RecipeCollectionLoader) => {
  return new DataLoader(async queries => {
    const res = await getRecipeCollectionsByBatch(queries as any)

    for (const page of res) {
      prime(loader, ...page.nodes)
    }

    return res
  }, options)
}

const recipeCollectionCountLoader = () => {
  return new DataLoader(countRecipeCollections, options)
}

export {
  recipeCollectionLoader,
  recipeCollectionByQueryLoader,
  recipeCollectionCountLoader
}
