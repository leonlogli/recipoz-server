import DataLoader, { Options } from 'dataloader'
import { Document } from 'mongoose'

import { BatchQuery } from './docUtils'
import { hash } from './Util'
import {
  UserDocument,
  RecipeDocument,
  RecipeSourceDocument,
  AccountDocument,
  TrackingDocument,
  NotificationDocument,
  CategoryDocument
} from '../models'
import { ApiError } from './errors'

export type DataLoaders = {
  userLoader: DataLoader<string, UserDocument | ApiError>
  recipeLoader: DataLoader<string, RecipeDocument | ApiError>
  recipeSourceLoader: DataLoader<string, RecipeSourceDocument | ApiError>
  accountLoader: DataLoader<string, AccountDocument | ApiError>
  trackingLoader: DataLoader<string, TrackingDocument | ApiError>
  notificationLoader: DataLoader<string, NotificationDocument | ApiError>
  categoryLoader: DataLoader<string, CategoryDocument | ApiError>
  recipeByQueryLoader: DataLoader<BatchQuery, RecipeDocument[]>
  recipeSourceByQueryLoader: DataLoader<BatchQuery, RecipeSourceDocument[]>
  accountByQueryLoader: DataLoader<BatchQuery, AccountDocument[]>
  trackingByQueryLoader: DataLoader<BatchQuery, TrackingDocument[]>
  notificationByQueryLoader: DataLoader<BatchQuery, NotificationDocument[]>
  categoryByQueryLoader: DataLoader<BatchQuery, CategoryDocument[]>
  recipeCountLoader: DataLoader<BatchQuery, number>
  recipeSourceCountLoader: DataLoader<BatchQuery, number>
  accountCountLoader: DataLoader<BatchQuery, number>
  trackingCountLoader: DataLoader<BatchQuery, number>
  notificationCountLoader: DataLoader<BatchQuery, number>
  categoryCountLoader: DataLoader<BatchQuery, number>
}

/**
 * Returns dataloader that correspond to the specified model name
 *
 * @param modelName mongoose model name
 * @param loaders dataloaders instance
 */
const getDataLoaderByModel = (modelName: string, loaders: DataLoaders) => {
  switch (modelName) {
    case 'Account':
      return loaders.accountLoader
    case 'User':
      return loaders.userLoader
    case 'Notification':
      return loaders.notificationLoader
    case 'Recipe':
      return loaders.recipeLoader
    case 'RecipeSource':
      return loaders.recipeSourceLoader
    case 'Tracking':
      return loaders.trackingLoader
    case 'Category':
      return loaders.categoryLoader
    default:
      return null
  }
}

/**
 * Add each doc in the specified docs to the matching dataloader cache
 * @param dataLoaders dataloaders instance
 * @param modelName model name
 * @param docs array of documents
 */
const primeDataLoader = (
  dataLoaders: DataLoaders,
  modelName: string,
  ...docs: Document[]
) => {
  const dataLoader = getDataLoaderByModel(modelName, dataLoaders)

  if (dataLoader) {
    docs
      .filter(doc => doc && doc._id)
      .forEach(doc => {
        dataLoader.prime(doc._id, doc as any)
      })
  }
}

const updateDataLoaderCache = (
  dataLoader: DataLoader<any, any>,
  data: Document | UserDocument
) => {
  dataLoader.clear(data._id)
  dataLoader.prime(data._id, data)
}

const dataByQueryLoaderOptions: Options<BatchQuery, any[], any> = {
  cacheKeyFn: query => {
    // the whole query is hashed
    return hash(query)
  }
}

const dataCountLoaderOptions: Options<BatchQuery, number, any> = {
  cacheKeyFn: query => {
    // Only the criteria of the query is hashed, because
    // count a doc does not need query options such as sort, page info etc.
    return hash(query.criteria)
  }
}

export {
  getDataLoaderByModel,
  primeDataLoader,
  dataByQueryLoaderOptions,
  dataCountLoaderOptions,
  updateDataLoaderCache as updateLoaderCache
}
