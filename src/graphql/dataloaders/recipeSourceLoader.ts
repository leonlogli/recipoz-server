import DataLoader from 'dataloader'

import { recipeSourceService } from '../../services'
import { dataByQueryLoaderOptions as options } from '../../utils'

const {
  getRecipeSourcesByBatch,
  getRecipeSources,
  countRecipeSources
} = recipeSourceService

const recipeSourceLoader = () => new DataLoader(getRecipeSources)

const recipeSourceByQueryLoader = () => {
  return new DataLoader(getRecipeSourcesByBatch, options)
}

const recipeSourceCountLoader = () => {
  return new DataLoader(countRecipeSources, options)
}

export {
  recipeSourceLoader,
  recipeSourceByQueryLoader,
  recipeSourceCountLoader
}
