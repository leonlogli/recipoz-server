/* eslint-disable quotes */
import { apolloClient as _ } from '../_.test'
import { ADD_INGREDIENT } from './graph'

const butter = {
  name: { en: 'Butter', fr: 'Beurre' },
  description: {
    en:
      'Butter is a dairy product made from the fat and protein components of milk or cream',
    fr:
      'Le beurre est un produit laitier extrait, par barattage, de la crème issue du lait'
  },
  image: 'https://cloudinary.com/Butter.jpg'
}

const oliveOil = {
  name: { en: 'Olive oil', fr: "Huile d'olive" },
  description: {
    en:
      'Olive oil is a liquid obtained from olives (the fruit of Olea europaea; family Oleaceae), a traditional tree crop of the Mediterranean Basin',
    fr:
      "L’huile d'olive est une variété d'huile alimentaire, à base de matière grasse végétale extraite des olives (fruits d'oliviers cultivés en oliveraie d'oléiculture) lors de la trituration dans un moulin à huile"
  },
  image: 'https://cloudinary.com/oliveoil.jpg'
}

const onion = {
  name: { en: 'Onion', fr: 'Oignon' },
  description: {
    fr:
      "L'oignon est une espèce herbacée, vivace par son bulbe unique, cultivée comme une annuelle ou bisannuelle (floraison la deuxième année)",
    en:
      'The onion is a herbaceous species, perennial by its single bulb, cultivated as an annual or biennial (flowering the second year)'
  },
  image: 'https://cloudinary.com/Onion.png'
}

const salt = {
  name: { en: 'Salt', fr: 'Sel' },
  description: {
    fr:
      'Le sel est utilisé dans de nombreuses cuisines du monde, et on le trouve souvent dans les salières sur les tables à manger des convives pour leur usage personnel dans les aliments',
    en:
      "Salt is used in many cuisines around the world, and it is often found in salt shakers on diners' eating tables for their personal use on food"
  },
  image: 'https://cloudinary.com/salt.png'
}

// helpers

const addIngredient = async (ingredient: any) => {
  const m: any = await _.mutate(ADD_INGREDIENT, { variables: { ingredient } })

  return m.data.addIngredient.id
}

const addIngredients = () => {
  return Promise.all([oliveOil, onion, butter, salt].map(i => addIngredient(i)))
}

export { butter, oliveOil, onion, salt, addIngredients, addIngredient }
