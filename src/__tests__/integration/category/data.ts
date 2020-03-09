/* eslint-disable quotes */
import { apolloClient as _ } from '../_.test'
import { ADD_CATEGORY } from './graph'

const vege = {
  name: { en: 'Vegetarian', fr: 'Végétarien' },
  description: {
    en:
      'The vegetarian diet is a diet that excludes animal proteins from food for ethical, environmental or health reasons.',
    fr:
      "Le régime végétarien est un régime qui exclut les protéines d'origine animale de l'alimentation pour des raisons éthiques, environnementales ou encore de santé."
  },
  thumbnail: 'https://cloudinary.com/Vegetarian.jpg'
}

const togo = {
  name: { en: 'Togolese', fr: 'Togolaise' },
  description: {
    en:
      'It is a particularly rich cuisine, very diverse and renowned throughout Africa',
    fr:
      "Il s'agit d'une cuisine particulièrement riche, très variée et réputée partout en Afrique"
  },
  thumbnail: 'https://cloudinary.com/Togolese.jpg'
}

const benin = {
  name: { en: 'Beninese', fr: 'Béninoise' },
  description: {
    fr:
      "La cuisine béninoise est essentiellement à base de pâte de maïs au sud du pays et d'igname au nord.",
    en:
      'Beninese cuisine is mainly based on corn paste in the south of the country and yam in the north.'
  },
  thumbnail: 'https://cloudinary.com/Beninese.png'
}

const breakfast = {
  name: { en: 'Breakfast', fr: 'Petit déjeuner' },
  description: {
    en: 'The first meal of the day especially when taken in the morning',
    fr: "Le premier repas de la journée surtout lorsqu'il est pris le matin"
  },
  thumbnail: 'https://cloudinary.com/Breakfast.jpg'
}

const dinner = {
  name: { en: 'Dinner', fr: 'Dîner' },
  description: {
    en:
      'The main meal of the day, taken either around midday or in the evening',
    fr: 'Le repas principal de la journée, pris vers midi ou le soir'
  },
  thumbnail: 'https://cloudinary.com/Dinner.jpg'
}

// Parent categories

const mealType = {
  name: { en: 'Meal Type', fr: 'Type de repas' },
  thumbnail: 'https://cloudinary.com/meal.jpg'
}

const health = {
  name: { en: 'Diet', fr: 'Régime' },
  thumbnail: 'https://cloudinary.com/Diet.jpg'
}

const cuisine = {
  name: { en: 'Cuisine', fr: 'Cuisine' },
  thumbnail: 'https://cloudinary.com/Cuisine.jpg'
}

// helpers

const addCategory = async (category: any) => {
  const m: any = await _.mutate(ADD_CATEGORY, { variables: { category } })

  return m.data.addCategory.id
}

const addCategories = async () => {
  const cuisineId = await addCategory(cuisine)
  const healthId = await addCategory(health)
  const mealTypeId = await addCategory(mealType)

  return Promise.all([
    addCategory({ ...togo, parentCategory: cuisineId }),
    addCategory({ ...benin, parentCategory: cuisineId }),
    addCategory({ ...vege, parentCategory: healthId }),
    addCategory({ ...dinner, parentCategory: mealTypeId }),
    addCategory({ ...breakfast, parentCategory: mealTypeId })
  ])
}

export {
  vege,
  togo,
  benin,
  breakfast,
  dinner,
  health,
  cuisine,
  mealType,
  addCategories,
  addCategory
}
