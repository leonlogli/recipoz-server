import { sourceService } from '../../services'

export default {
  Query: {
    sourceById: async (parent, { id }) => {
      return sourceService.getSourceById(id)
    },
    source: async (parent, { criteria, filter }) => {
      return sourceService.getSource(criteria, filter)
    },
    sources: async (parent, { criteria, options }) => {
      return sourceService.getSources(criteria, options)
    },
    searchSources: async (parent, { criteria, options }) => {
      return sourceService.getSources(criteria, options)
    }
  },
  Mutation: {
    addSource: async (parent, { source }) => {
      return sourceService.addSource(source)
    },
    updateSource: async (parent, { id, source }) => {
      return sourceService.updateSource(id, source)
    },
    deleteSource: async (parent, { id }) => {
      return sourceService.deleteSource(id)
    }
  }
}
