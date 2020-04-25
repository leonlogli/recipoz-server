/* eslint-disable no-useless-escape */
import pluralize from 'pluralize'

import { detectLanguage, SupportedLanguage } from './i18n'
import { ingredients } from '../resources'

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

const getCategoryFromIngredient = (ingr: string, lang?: SupportedLanguage) => {
  let ingredientsData = ingredients.en

  if (lang === 'fr') {
    ingredientsData = ingredients.fr
  }
  let item = ingredientsData.find(i => i.name === ingr)

  if (item) {
    return item.category
  }
  const items = ingredientsData.filter(
    i =>
      ingr.includes(i.name) ||
      ingr.includes(pluralize(i.name)) ||
      ingr.includes(pluralize.singular(i.name))
  )

  if (items.length > 0) {
    item = items.find(i => ingr.includes(`${i.name} `))
    if (item) {
      return item.category
    }

    item = items.find(i => ingr.includes(`${i.name}s `))
    if (item) {
      return item.category
    }

    item = items.find(i => ingr.includes(`${pluralize(i.name)} `))
    if (item) {
      return item.category
    }

    item = items.find(i => ingr.includes(`${pluralize.singular(i.name)} `))
    if (item) {
      return item.category
    }

    item = items.find(i => ingr.endsWith(i.name) || ingr.endsWith(`${i.name}s`))
    if (item) {
      return item.category
    }

    item = items.find(i => ingr.endsWith(pluralize(i.name)))
    if (item) {
      return item.category
    }

    item = items.find(i => ingr.endsWith(pluralize.singular(i.name)))
    if (item) {
      return item.category
    }
  }
}

const getIngredientCategory = (ingredient: string) => {
  const lang = detectLanguage(ingredient)
  const ingr = purifyTrailingChar(ingredient.toLowerCase()).trim()
  let category

  if (!lang || lang === 'fr') {
    category = getCategoryFromIngredient(ingr, 'fr')

    if (category) {
      return category
    }
  }

  category = getCategoryFromIngredient(ingr, 'en')

  return category || 'OTHER'
}

export { getIngredientCategory }
