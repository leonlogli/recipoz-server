import { DataLoaders, i18n, locales, truncate } from '../../../utils'
import { loadNewRecipes } from '../actors'
import { NotificationInput } from '../notificationServiceHelper'

const { notificationMessages } = locales
const { newRecipePublished } = notificationMessages
const { t } = i18n

const newRecipesNotificationInfo = async (
  input: NotificationInput,
  loaders: DataLoaders
) => {
  const [newRecipes, targetRecipe] = await Promise.all([
    loadNewRecipes(input, loaders),
    loaders.recipeLoader.load(input.data)
  ])

  const { actor, recipesCount: count } = newRecipes
  const user = actor.name

  let text
  const recipe = truncate(targetRecipe.name, 30)

  if (count === 1) {
    text = t(newRecipePublished, { user, recipe })
  }

  if (count > 2) {
    text = t(newRecipePublished, { user, count })
  }

  // Acotors field here is just for type compatibility
  return { text, actors: [actor], ...newRecipes }
}

export { newRecipesNotificationInfo }
export default newRecipesNotificationInfo
