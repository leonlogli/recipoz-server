/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'

import {
  NUTRITIONIX_API_APP_ID,
  NUTRITIONIX_API_APP_KEY,
  NUTRITIONIX_API_URL,
  EDAMAM_API_APP_KEY,
  EDAMAM_API_URL,
  logger
} from '../config'
import { sumProperties } from '../utils'

const getNutritionLabels = async (serving: number, ingredients: string[]) => {
  try {
    const response = await axios.get(EDAMAM_API_URL as string, {
      params: {
        app_id: EDAMAM_API_APP_KEY
      },
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        yield: serving,
        ingr: ingredients
      }
    })

    return [...response.data.dietLabels, ...response.data.healthLabels]
  } catch (error) {
    logger.error(`Error while getting nutrition labels: ${error}`)
  }
}

const getNutritionFacts = async (ingredients: string[]) => {
  try {
    const response = await axios.get(NUTRITIONIX_API_URL as string, {
      headers: {
        'x-app-id': NUTRITIONIX_API_APP_ID,
        'x-app-key': NUTRITIONIX_API_APP_KEY,
        'Content-Type': 'application/json',
        'x-remote-user-id': 0
      },
      data: { query: ingredients.join('\n') }
    })

    if (response.data.foods) {
      const nutritionFacts = response.data.foods.map((food: any) => {
        const { full_nutrients } = food

        return {
          calories: food.nf_calories,
          fat: food.nf_total_fat,
          saturatedFat: food.nf_saturated_fat,
          cholesterol: food.nf_cholesterol,
          sodium: food.nf_sodium,
          carbs: food.nf_total_carbohydrate,
          dietaryFiber: food.nf_dietary_fiber,
          sugars: food.nf_sugars,
          protein: food.nf_protein,
          potassium: food.nf_potassium,
          transFat: full_nutrients.find((n: any) => n.attr_id === 605).value,
          vitA: full_nutrients.find((n: any) => n.attr_id === 320).value, // in mcg RAE
          vitC: full_nutrients.find((n: any) => n.attr_id === 401).value, // in mcg RAE
          calcium: full_nutrients.find((n: any) => n.attr_id === 301).value,
          iron: full_nutrients.find((n: any) => n.attr_id === 303).value
        }
      })

      return sumProperties(nutritionFacts)
    }
  } catch (error) {
    logger.error(`Error while getting nutrition facts: ${error}`)
  }
}

export { getNutritionLabels, getNutritionFacts }
