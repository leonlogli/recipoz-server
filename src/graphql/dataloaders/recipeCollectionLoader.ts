import DataLoader from 'dataloader'

import { recipeCollectionService } from '../../services'
import { dataByQueryLoaderOptions as options } from '../../utils'

const {
  getRecipeCollectionsByBatch,
  getRecipeCollections,
  countRecipeCollections
} = recipeCollectionService

const recipeCollectionLoader = () => new DataLoader(getRecipeCollections)

const recipeCollectionByQueryLoader = () => {
  return new DataLoader(getRecipeCollectionsByBatch, options)
}

const recipeCollectionCountLoader = () => {
  return new DataLoader(countRecipeCollections, options)
}

export {
  recipeCollectionLoader,
  recipeCollectionByQueryLoader,
  recipeCollectionCountLoader
}
