import { errorMessages } from '../constants'
import { Source } from '../models'
import { QueryOptions, DocTransformOptions } from '../utils'
import ModelService from './ModelService'

const {
  notFound: dataNotFound,
  deleteNotFound: dataToDeleteNotFound,
  updateNotFound: dataToUpdateNotFound
} = errorMessages.source

const docTransformOptions: DocTransformOptions = {
  i18nFields: [],
  refDocs: [{ parentSource: 'Source' }]
}

const partialSearchFields = ['name.en', 'name.fr', 'code']

const sourceModel = new ModelService({
  model: Source,
  docTransformOptions,
  partialSearchFields,
  errorMessages: { dataNotFound, dataToDeleteNotFound, dataToUpdateNotFound }
})

const getSourceById = async (id: any) => {
  return sourceModel.findById(id)
}

const getSource = async (criteria: any, filter: string[]) => {
  return sourceModel.findOne(criteria, filter)
}

const getSources = async (criteria: any, options: QueryOptions) => {
  return sourceModel.find(criteria, options)
}

const addSource = async (source: any) => {
  return sourceModel.create(source)
}

const updateSource = async (id: any, source: any) => {
  return sourceModel.update(id, source)
}

const deleteSource = async (id: any) => {
  return sourceModel.delete(id)
}

export default {
  getSourceById,
  getSource,
  getSources,
  addSource,
  deleteSource,
  updateSource
}
