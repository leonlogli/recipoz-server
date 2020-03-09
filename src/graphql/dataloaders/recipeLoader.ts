import DataLoader from 'dataloader'

import { Recipe } from '../../models'
import { ApiError } from '../../utils'
import { errorMessages } from '../../constants'

const recipeLoader = () => {
  return new DataLoader(async (ids: any) => {
    const recipes = await Recipe.find({ _id: { $in: ids } })
      .lean()
      .exec() // may return data in a different order than ids'

    // The results must be returned in the same order of the keys (ids) passed to this function
    return ids.map(
      (id: any) =>
        recipes.find(recipe => recipe._id.toString() === id) ||
        new ApiError(errorMessages.recipe.notFound, '404')
    )
  })
}

export { recipeLoader }
export default recipeLoader
