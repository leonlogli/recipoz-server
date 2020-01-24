import { errorMessages } from '../constants'
import { UtensilDocument, Utensil } from '../models'
import { QueryOptions, DocTransformOptions } from '../utils'
import ModelService from './ModelService'

const {
  notFound: dataNotFound,
  deleteNotFound: dataToDeleteNotFound,
  updateNotFound: dataToUpdateNotFound
} = errorMessages.utensil

const docTransformOptions: DocTransformOptions = {
  i18nFields: ['name', 'description']
}

const partialSearchFields = [
  'name.en',
  'name.fr',
  'description.en',
  'description.fr'
]

const utensilModel = new ModelService({
  model: Utensil,
  docTransformOptions,
  partialSearchFields,
  errorMessages: { dataNotFound, dataToDeleteNotFound, dataToUpdateNotFound }
})

const getUtensilById = async (id: any) => {
  return utensilModel.findById(id)
}

const getUtensil = async (criteria: any, filter: string[]) => {
  return utensilModel.findOne(criteria, filter)
}

const getUtensils = async (criteria: any, options: QueryOptions) => {
  return utensilModel.find(criteria, options)
}

const addUtensil = async (utensil: any) => {
  return utensilModel.create(utensil)
}

const updateUtensil = async (id: any, utensil: UtensilDocument) => {
  return utensilModel.update(id, utensil)
}

const deleteUtensil = async (id: any) => {
  return utensilModel.delete(id)
}

export default {
  getUtensilById,
  getUtensil,
  getUtensils,
  addUtensil,
  deleteUtensil,
  updateUtensil
}
