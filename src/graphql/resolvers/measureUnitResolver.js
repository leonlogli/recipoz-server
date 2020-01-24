import { measureUnitService } from '../../services'

export default {
  Query: {
    measureUnitById: async (parent, { id }) => {
      return measureUnitService.getMeasureUnitById(id)
    },
    measureUnit: async (parent, { criteria, filter }) => {
      return measureUnitService.getMeasureUnit(criteria, filter)
    },
    measureUnits: async (parent, { criteria, options }) => {
      return measureUnitService.getMeasureUnits(criteria, options)
    },
    searchMeasureUnits: async (parent, { criteria, options }) => {
      return measureUnitService.getMeasureUnits(criteria, options)
    }
  },
  Mutation: {
    addMeasureUnit: async (parent, { measureUnit }) => {
      return measureUnitService.addMeasureUnit(measureUnit)
    },
    updateMeasureUnit: async (parent, { id, measureUnit }) => {
      return measureUnitService.updateMeasureUnit(id, measureUnit)
    },
    deleteMeasureUnit: async (parent, { id }) => {
      return measureUnitService.deleteMeasureUnit(id)
    }
  }
}
