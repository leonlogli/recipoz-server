import DataLoader from 'dataloader'

import { recipeService } from '../../services'
import { dataByQueryLoaderOptions as options, prime } from '../../utils'

const { getRecipesByBatch, getRecipes, countRecipes } = recipeService

const recipeLoader = () => new DataLoader(getRecipes)

type RecipeLoader = ReturnType<typeof recipeLoader>

const recipeByQueryLoader = (loader: RecipeLoader) => {
  return new DataLoader(async queries => {
    const res = await getRecipesByBatch(queries as any)

    for (const page of res) {
      prime(loader, ...page.nodes)
    }

    return res
  }, options)
}

const recipeCountLoader = () => {
  return new DataLoader(countRecipes, options)
}

export { recipeLoader, recipeByQueryLoader, recipeCountLoader }
