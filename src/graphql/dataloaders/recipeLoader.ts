import DataLoader from 'dataloader'

import { recipeService } from '../../services'
import { dataByQueryLoaderOptions as options } from '../../utils'

const { getRecipesByBatch, getRecipes, countRecipes } = recipeService

const recipeLoader = () => new DataLoader(getRecipes)

const recipeByQueryLoader = () => {
  return new DataLoader(getRecipesByBatch, options)
}

const recipeCountLoader = () => {
  return new DataLoader(countRecipes, options)
}

export { recipeLoader, recipeByQueryLoader, recipeCountLoader }
