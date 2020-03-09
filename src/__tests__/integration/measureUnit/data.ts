/* eslint-disable quotes */
import { apolloClient as _ } from '../_.test'
import { ADD_MEASUREUNIT } from './graph'

const teaspoon = {
  name: { en: 'teaspoon', fr: 'cuillère à café' },
  description: {
    en:
      'A teaspoon is a unit of volume measure equal to 1/3 tablespoon. It is exactly equal to 5 mL. In the USA there are 16 teaspoons in 1/3 cup, and there are 6 teaspoons in 1 fluid ounce.',
    fr:
      'Une cuillère à café est une unité de mesure de volume égale à 1/3 cuillère à soupe. Il est exactement égal à 5 ​​ml. Aux États-Unis, il y a 16 cuillères à café dans 1/3 tasse et 6 cuillères à café dans 1 once liquide'
  }
}

const tablespoon = {
  name: { en: 'tablespoon', fr: 'cuillerée à soupe' },
  description: {
    en:
      'A tablespoon is a unit of measure equal to 1/16 cup, 3 teaspoons, or 1/2 fluid ounce in the USA. It is either approximately or (in some countries) exactly equal to 15 mL',
    fr:
      'Une cuillère à soupe est une unité de mesure égale à 1/16 tasse, 3 cuillères à café ou 1/2 once liquide aux États-Unis. Il est soit approximativement ou (dans certains pays) exactement égal à 15 ml'
  }
}

const cup = {
  name: { en: 'cup', fr: 'tasse' },
  description: {
    fr:
      'Une tasse est une unité de mesure de volume de volume égale à 16 cuillères à soupe, ½ pinte, ¼ pinte ou 8 onces liquides.',
    en:
      'A cup is a unit of volume measurement of volume equal to 16 tablespoons, ½ pint, ¼ quart, or 8 fluid ounces.'
  }
}

const ounce = {
  name: { en: 'ounce', fr: 'once' },
  description: {
    fr:
      "L'once (avoirdupois) est une unité de masse égale à 1/16 de livre ou environ 28 g",
    en:
      'The ounce (avoirdupois) is a unit of mass equal to 1/16 of a pound or about 28 g'
  }
}

// helpers

const addMeasureUnit = async (measureUnit: any) => {
  const m: any = await _.mutate(ADD_MEASUREUNIT, { variables: { measureUnit } })

  return m.data.addMeasureUnit.id
}

const addMeasureUnits = () => {
  return Promise.all(
    [tablespoon, cup, teaspoon, ounce].map(i => addMeasureUnit(i))
  )
}

export { teaspoon, tablespoon, cup, ounce, addMeasureUnits, addMeasureUnit }
