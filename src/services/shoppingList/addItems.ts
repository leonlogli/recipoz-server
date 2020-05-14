import { ShoppingListItemDocument } from '../../models'
import { DataLoaders, i18n, clean, errorRes, locales } from '../../utils'
import { ModelService } from '../base'
import getIngredientCategory from './ingredientCategory'

const { statusMessages, errorMessages } = locales
const { internalServerError } = errorMessages
const { added } = statusMessages.shoppingListItem
const { t } = i18n

let shoppingListModel: ModelService<ShoppingListItemDocument>

const addShoppingListItem = async (input: any, loaders: DataLoaders) => {
  try {
    const { account, name, quantity, recipe } = input
    let query: any = clean({ account, name, quantity })

    const category = getIngredientCategory(name)
    let data: any = { $set: input, $setOnInsert: { category } }

    if (recipe) {
      const doc = await loaders.recipeLoader.load(recipe)

      if (doc.ingredients.find((i: any) => i.name === name)) {
        query = { account, name, recipe }
      } else data = { ...data, $set: { ...input, recipe: undefined } }
    }

    const shoppingListItem = await shoppingListModel.createOrUpdate(query, data)
    const message = t(added, { count: 1 })

    return { success: true, message, code: 200, shoppingListItem }
  } catch (error) {
    return errorRes(error)
  }
}

const addShoppingListItems = async (input: any, loaders: DataLoaders) => {
  try {
    const { recipe, account, items } = input
    const data: any[] = items.map((item: any) => ({ ...item, recipe, account }))

    const res = await Promise.all(
      data.map(item => addShoppingListItem(item, loaders))
    )
    const shoppingListItems = res.filter(addedItem => addedItem.success)

    const success = shoppingListItems.length > 0
    const successMsg = t(added, { count: shoppingListItems.length })
    const message = success ? successMsg : t(internalServerError)

    return { success, message, code: success ? 201 : 500, shoppingListItems }
  } catch (error) {
    return errorRes(error)
  }
}

const initModel = (model: typeof shoppingListModel) => {
  shoppingListModel = model

  return { addShoppingListItem, addShoppingListItems }
}

export default initModel
