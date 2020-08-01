import {
  fromGlobalId,
  getDataLoaderByModel,
  isValidObjectId,
  deleteUpload
} from '../../utils'
import { Context } from '../context'
import { logger } from '../../config'

export default {
  Query: {
    node: (_: any, { id: guid }: any, { dataLoaders }: Context) => {
      const { type, id } = fromGlobalId(guid)
      const dataLoader = getDataLoaderByModel(type as any, dataLoaders) as any

      if (!dataLoader || !isValidObjectId(id)) {
        return null
      }

      return dataLoader.load(id).catch((e: Error) => {
        logger.error(`Error fetching node (${id}): `, e)
      })
    }
  },
  Mutation: {
    deleteUploads: (_: any, { publicIds }: any) => {
      return Promise.all(
        publicIds.map((publicId: string) => deleteUpload(publicId))
      )
    }
  },
  Node: {
    // Each node has already __typename property to resolve to appropriate type.
    // That said, we don't need to define explixitly '__resolveType' functyion,
    // but we do it just to avoid apollo server warning about "__resolveType" missing
    __resolveType: (node: any) => node.__typename
  },
  Language: {
    EN: 'en',
    FR: 'fr'
  }
}
