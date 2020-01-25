import { errorMessages } from '../constants'
import { MeasureUnit } from '../models'
import { QueryOptions, DocTransformOptions } from '../utils'
import ModelService from './ModelService'

const {
  notFound: dataNotFound,
  deleteNotFound: dataToDeleteNotFound,
  updateNotFound: dataToUpdateNotFound
} = errorMessages.measureUnit

const docTransformOptions: DocTransformOptions = {
  i18nFields: ['name', 'description']
}

const partialSearchFields = [
  'name.en',
  'name.fr',
  'description.en',
  'description.fr'
]

const measureUnitModel = new ModelService({
  model: MeasureUnit,
  docTransformOptions,
  partialSearchFields,
  errorMessages: { dataNotFound, dataToDeleteNotFound, dataToUpdateNotFound }
})

const getMeasureUnitById = async (id: any) => {
  return measureUnitModel.findById(id)
}

const getMeasureUnit = async (criteria: any, filter: string[]) => {
  return measureUnitModel.findOne(criteria, filter)
}

const getMeasureUnits = async (criteria: any, options: QueryOptions) => {
  return measureUnitModel.find(criteria, options)
}

const addMeasureUnit = async (measureUnit: any) => {
  return measureUnitModel.create(measureUnit)
}

const updateMeasureUnit = async (id: any, measureUnit: any) => {
  return measureUnitModel.update(id, measureUnit)
}

const deleteMeasureUnit = async (id: any) => {
  return measureUnitModel.delete(id)
}

export default {
  getMeasureUnitById,
  getMeasureUnit,
  getMeasureUnits,
  addMeasureUnit,
  deleteMeasureUnit,
  updateMeasureUnit
}
