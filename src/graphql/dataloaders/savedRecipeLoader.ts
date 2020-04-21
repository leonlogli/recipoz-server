import DataLoader from 'dataloader'

import { savedRecipeService } from '../../services'
import { dataByQueryLoaderOptions as options } from '../../utils'

const { getSavedRecipesByBatch, countSavedRecipesByBatch } = savedRecipeService

const savedRecipeByQueryLoader = () => {
  return new DataLoader(getSavedRecipesByBatch, options)
}

const savedRecipeCountLoader = () => {
  return new DataLoader(countSavedRecipesByBatch, options)
}

export { savedRecipeByQueryLoader, savedRecipeCountLoader }
