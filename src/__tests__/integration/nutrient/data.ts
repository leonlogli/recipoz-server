/* eslint-disable quotes */
import { apolloClient as _ } from '../_.test'
import { ADD_NUTRIENT } from './graph'

const calcium = {
  name: { en: 'Calcium', fr: 'Calcium' },
  code: 'CA'
}

const carbs = {
  name: { en: 'Carbs', fr: 'Glucides' },
  code: 'CHOCDF'
}

const cholesterol = {
  name: { en: 'Cholesterol', fr: 'Cholestérol' },
  code: 'CHOLE'
}

const fat = {
  name: { en: 'Fat', fr: 'Graisse' },
  code: 'FAT'
}

// helpers

const addNutrient = async (nutrient: any) => {
  const m: any = await _.mutate(ADD_NUTRIENT, { variables: { nutrient } })

  return m.data.addNutrient.id
}

const addNutrients = () => {
  return Promise.all(
    [carbs, cholesterol, calcium, fat].map(i => addNutrient(i))
  )
}

export { calcium, carbs, cholesterol, fat, addNutrients, addNutrient }
