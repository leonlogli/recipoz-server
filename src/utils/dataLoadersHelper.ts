import DataLoader, { Options } from 'dataloader'
import { Document } from 'mongoose'

import { toBase64 } from './base64'
import {
  UserDocument,
  RecipeDocument,
  RecipeSourceDocument,
  AccountDocument,
  AbuseReportDocument,
  NotificationDocument,
  CategoryDocument,
  CommentDocument,
  SavedRecipeDocument,
  RecipeCollectionDocument as RecipeCollectionDoc,
  FollowershipDocument,
  ShoppingListItemDocument as ShoppingListItemDoc,
  CommentReactionDocument
} from '../models'
import { CursorPagingQuery as Query, Page } from './mongoose/pagination'
import { ApiError } from './errors'
import { ModelName } from './mongoose'

export type DataLoaders = {
  recipeLoader: DataLoader<string, RecipeDocument | ApiError>
  recipeSourceLoader: DataLoader<string, RecipeSourceDocument | ApiError>
  accountLoader: DataLoader<string, AccountDocument | ApiError>
  abuseReportLoader: DataLoader<string, AbuseReportDocument | ApiError>
  notificationLoader: DataLoader<string, NotificationDocument | ApiError>
  categoryLoader: DataLoader<string, CategoryDocument | ApiError>
  commentLoader: DataLoader<string, CommentDocument | ApiError>
  recipeCollectionLoader: DataLoader<string, RecipeCollectionDoc | ApiError>
  shoppingListItemLoader: DataLoader<string, ShoppingListItemDoc | ApiError>
  userLoader: DataLoader<string, UserDocument | null>
  recipeByQueryLoader: DataLoader<Query, Page<CategoryDocument>>
  recipeSourceByQueryLoader: DataLoader<Query, Page<RecipeSourceDocument>>
  accountByQueryLoader: DataLoader<Query, Page<AccountDocument>>
  abuseReportByQueryLoader: DataLoader<Query, Page<AbuseReportDocument>>
  notificationByQueryLoader: DataLoader<Query, Page<NotificationDocument>>
  categoryByQueryLoader: DataLoader<Query, Page<CategoryDocument>>
  commentByQueryLoader: DataLoader<Query, Page<CommentDocument>>
  shoppingListItemByQueryLoader: DataLoader<Query, Page<ShoppingListItemDoc>>
  recipeCollectionByQueryLoader: DataLoader<Query, Page<RecipeCollectionDoc>>
  savedRecipeByQueryLoader: DataLoader<Query, Page<SavedRecipeDocument>>
  commentReactionByQueryLoader: DataLoader<Query, Page<CommentReactionDocument>>
  followershipByQueryLoader: DataLoader<Query, Page<FollowershipDocument>>
  recipeCountLoader: DataLoader<Record<string, any>, number>
  recipeSourceCountLoader: DataLoader<Record<string, any>, number>
  accountCountLoader: DataLoader<Record<string, any>, number>
  followershipCountLoader: DataLoader<Record<string, any>, number>
  abuseReportCountLoader: DataLoader<Record<string, any>, number>
  notificationCountLoader: DataLoader<Record<string, any>, number>
  categoryCountLoader: DataLoader<Record<string, any>, number>
  commentCountLoader: DataLoader<Record<string, any>, number>
  recipeCollectionCountLoader: DataLoader<Record<string, any>, number>
  shoppingListItemCountLoader: DataLoader<Record<string, any>, number>
  savedRecipeCountLoader: DataLoader<Record<string, any>, number>
  commentReactionCountLoader: DataLoader<Record<string, any>, number>
}

/**
 * Returns dataloader that correspond to the specified model name
 * @param modelName mongoose model name
 * @param loaders dataloaders instance
 */
const getDataLoaderByModel = (modelName: ModelName, loaders: DataLoaders) => {
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
    case 'AbuseReport':
      return loaders.abuseReportLoader
    case 'Category':
      return loaders.categoryLoader
    case 'Comment':
      return loaders.commentLoader
    case 'RecipeCollection':
      return loaders.recipeCollectionLoader
    case 'ShoppingListItem':
      return loaders.shoppingListItemLoader
    default:
      return null
  }
}

const prime = (dataLoader: DataLoader<any, any>, ...docs: Document[]) => {
  docs
    .filter(doc => doc && doc._id)
    .forEach(doc => {
      dataLoader.prime(String(doc._id), doc)
    })

  return dataLoader
}

const updateDataLoaderCache = (
  dataLoader: DataLoader<string, any>,
  data: Document | UserDocument
) => {
  dataLoader.clear(data._id)

  return prime(dataLoader, data as Document)
}

const dataByQueryLoaderOptions: Options<object, any, string> = {
  cacheKeyFn: query => {
    return toBase64(query)
  }
}

export {
  prime,
  getDataLoaderByModel,
  dataByQueryLoaderOptions,
  updateDataLoaderCache
}
