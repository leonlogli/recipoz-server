import DataLoader from 'dataloader'

import { recipeSourceService } from '../../services'
import { dataByQueryLoaderOptions as options, prime } from '../../utils'

const {
  getRecipeSourcesByBatch,
  getRecipeSources,
  countRecipeSources
} = recipeSourceService

const recipeSourceLoader = () => new DataLoader(getRecipeSources)

type RecipeSourceLoader = ReturnType<typeof recipeSourceLoader>

const recipeSourceByQueryLoader = (loader: RecipeSourceLoader) => {
  return new DataLoader(async queries => {
    const res = await getRecipeSourcesByBatch(queries as any)

    for (const page of res) {
      prime(loader, ...page.nodes)
    }

    return res
  }, options)
}

const recipeSourceCountLoader = () => {
  return new DataLoader(countRecipeSources, options)
}

export {
  recipeSourceLoader,
  recipeSourceByQueryLoader,
  recipeSourceCountLoader
}
