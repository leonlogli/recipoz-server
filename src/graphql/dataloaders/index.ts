import {
  accountLoader,
  accountByQueryLoader,
  accountCountLoader
} from './accountLoader'
import { DataLoaders } from '../../utils'
import {
  categoryLoader,
  categoryByQueryLoader,
  categoryCountLoader
} from './categoryLoader'
import {
  notificationLoader,
  notificationByQueryLoader,
  notificationCountLoader
} from './notificationLoader'
import {
  recipeLoader,
  recipeByQueryLoader,
  recipeCountLoader
} from './recipeLoader'
import {
  recipeSourceLoader,
  recipeSourceByQueryLoader,
  recipeSourceCountLoader
} from './recipeSourceLoader'
import userLoader from './userLoader'
import {
  recipeCollectionLoader,
  recipeCollectionByQueryLoader,
  recipeCollectionCountLoader
} from './recipeCollectionLoader'
import {
  savedRecipeByQueryLoader,
  savedRecipeCountLoader
} from './savedRecipeLoader'
import {
  followershipByQueryLoader,
  followershipCountLoader
} from './followershipLoader'
import {
  commentLoader,
  commentByQueryLoader,
  commentCountLoader
} from './commentLoader'
import {
  abuseReportLoader,
  abuseReportByQueryLoader,
  abuseReportCountLoader
} from './abuseReportLoader'
import {
  commentReactionByQueryLoader,
  commentReactionCountLoader
} from './commentReactionLoader'
import {
  shoppingListItemLoader,
  shoppingListItemByQueryLoader,
  shoppingListItemCountLoader
} from './shoppingItemLoader'

/**
 * Returns a function that creates all dataloaders. Dataloaders must be created in the
 * context (to ensure new instance on each request). So instead of instanciating them
 * direactly, it is recommanded to return a function that will create them when called
 */
export const createDataLoaders = (): DataLoaders => {
  return {
    accountLoader: accountLoader(),
    accountByQueryLoader: accountByQueryLoader(),
    accountCountLoader: accountCountLoader(),
    categoryLoader: categoryLoader(),
    categoryByQueryLoader: categoryByQueryLoader(),
    categoryCountLoader: categoryCountLoader(),
    recipeCollectionLoader: recipeCollectionLoader(),
    recipeCollectionByQueryLoader: recipeCollectionByQueryLoader(),
    recipeCollectionCountLoader: recipeCollectionCountLoader(),
    shoppingListItemLoader: shoppingListItemLoader(),
    shoppingListItemByQueryLoader: shoppingListItemByQueryLoader(),
    shoppingListItemCountLoader: shoppingListItemCountLoader(),
    recipeLoader: recipeLoader(),
    recipeCountLoader: recipeCountLoader(),
    recipeByQueryLoader: recipeByQueryLoader(),
    recipeSourceLoader: recipeSourceLoader(),
    recipeSourceByQueryLoader: recipeSourceByQueryLoader(),
    recipeSourceCountLoader: recipeSourceCountLoader(),
    savedRecipeByQueryLoader: savedRecipeByQueryLoader(),
    savedRecipeCountLoader: savedRecipeCountLoader(),
    followershipByQueryLoader: followershipByQueryLoader(),
    followershipCountLoader: followershipCountLoader(),
    userLoader: userLoader(),
    commentLoader: commentLoader(),
    commentByQueryLoader: commentByQueryLoader(),
    commentCountLoader: commentCountLoader(),
    commentReactionByQueryLoader: commentReactionByQueryLoader(),
    commentReactionCountLoader: commentReactionCountLoader(),
    abuseReportLoader: abuseReportLoader(),
    abuseReportByQueryLoader: abuseReportByQueryLoader(),
    abuseReportCountLoader: abuseReportCountLoader(),
    notificationLoader: notificationLoader(),
    notificationByQueryLoader: notificationByQueryLoader(),
    notificationCountLoader: notificationCountLoader()
  }
}
export default createDataLoaders
