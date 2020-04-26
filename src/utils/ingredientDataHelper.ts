/* eslint-disable no-useless-escape */
import pluralize from 'pluralize'

import { detectLanguage, SupportedLanguage } from './i18n'
import { ingredients } from '../resources'

type Item = typeof ingredients.en[number]

/**
 * Remove the trailing numbers and punctuations characters of the specified text
 */
const purifyTrailingChar = (text: string) => {
  if (!/[.,\/#!?$%\^&\*;:{}=\-_`~()0-9]/g.test(text.slice(-1))) {
    return text
  }
  let res = text

  for (let i = 0; i < text.length; i++) {
    if (/[.,\/#!?$%\^&\*;:{}=\-_`~()0-9]/.test(res.slice(-1))) {
      res = res.slice(0, -1)
    } else break
  }

  return res
}

/**
 * Return true if the given item match the specified ingredient
 */
const isMatchedItem = (item: Item, ingredient: string) => {
  return (
    ingredient.includes(`${item.name} `) ||
    ingredient.includes(`${item.name},`) ||
    ingredient.includes(`${item.name}s `) ||
    ingredient.includes(`${pluralize(item.name)} `) ||
    ingredient.includes(`${pluralize.singular(item.name)} `) ||
    ingredient.endsWith(item.name) ||
    ingredient.endsWith(`${item.name}s`) ||
    ingredient.endsWith(pluralize(item.name)) ||
    ingredient.endsWith(pluralize.singular(item.name))
  )
}

const findCategory = (ingredient: string, lang?: SupportedLanguage) => {
  let ingredientsData = ingredients.en

  if (lang === 'fr') {
    ingredientsData = ingredients.fr
  }
  const itemFound = ingredientsData.find(i => i.name === ingredient)

  if (itemFound) {
    return itemFound.category
  }
  const items = ingredientsData
    .filter(
      i =>
        ingredient.includes(i.name) ||
        ingredient.includes(pluralize(i.name)) ||
        ingredient.includes(pluralize.singular(i.name))
    )
    .sort((a, b) => b.name.length - a.name.length)

  if (items.length > 0) {
    for (const item of items) {
      if (isMatchedItem(item, ingredient)) {
        return item.category
      }
    }
  }
}

const getIngredientCategory = (ingredient: string) => {
  const lang = detectLanguage(ingredient)
  const ingr = purifyTrailingChar(ingredient.toLowerCase()).trim()
  let category

  if (!lang || lang === 'fr') {
    category = findCategory(ingr, 'fr')

    if (category) {
      return category
    }
  }

  category = findCategory(ingr, 'en')

  return category || 'OTHER'
}

export { getIngredientCategory }
