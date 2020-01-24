import { errorMessages } from '../constants'
import { NutrientDocument, Nutrient } from '../models'
import { QueryOptions, DocTransformOptions } from '../utils'
import ModelService from './ModelService'

const {
  notFound: dataNotFound,
  deleteNotFound: dataToDeleteNotFound,
  updateNotFound: dataToUpdateNotFound
} = errorMessages.nutrient

const docTransformOptions: DocTransformOptions = {
  i18nFields: ['name'],
  refDocs: [{ parentNutrient: 'Nutrient' }]
}

const partialSearchFields = ['name.en', 'name.fr', 'code']

const nutrientModel = new ModelService({
  model: Nutrient,
  docTransformOptions,
  partialSearchFields,
  errorMessages: { dataNotFound, dataToDeleteNotFound, dataToUpdateNotFound }
})

const getNutrientById = async (id: any) => {
  return nutrientModel.findById(id)
}

const getNutrient = async (criteria: any, filter: string[]) => {
  return nutrientModel.findOne(criteria, filter)
}

const getNutrients = async (criteria: any, options: QueryOptions) => {
  return nutrientModel.find(criteria, options)
}

const addNutrient = async (nutrient: any) => {
  return nutrientModel.create(nutrient)
}

const updateNutrient = async (id: any, nutrient: NutrientDocument) => {
  return nutrientModel.update(id, nutrient)
}

const deleteNutrient = async (id: any) => {
  return nutrientModel.delete(id)
}

export default {
  getNutrientById,
  getNutrient,
  getNutrients,
  addNutrient,
  deleteNutrient,
  updateNutrient
}
