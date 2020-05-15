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
  const dataByIdLoaders = {
    accountLoader: accountLoader(),
    categoryLoader: categoryLoader(),
    recipeCollectionLoader: recipeCollectionLoader(),
    shoppingListItemLoader: shoppingListItemLoader(),
    recipeLoader: recipeLoader(),
    recipeSourceLoader: recipeSourceLoader(),
    commentLoader: commentLoader(),
    abuseReportLoader: abuseReportLoader(),
    notificationLoader: notificationLoader(),
    userLoader: userLoader()
  }

  return {
    ...dataByIdLoaders,
    accountByQueryLoader: accountByQueryLoader(dataByIdLoaders.accountLoader),
    accountCountLoader: accountCountLoader(),
    categoryByQueryLoader: categoryByQueryLoader(
      dataByIdLoaders.categoryLoader
    ),
    categoryCountLoader: categoryCountLoader(),
    recipeCollectionByQueryLoader: recipeCollectionByQueryLoader(
      dataByIdLoaders.recipeCollectionLoader
    ),
    recipeCollectionCountLoader: recipeCollectionCountLoader(),
    shoppingListItemByQueryLoader: shoppingListItemByQueryLoader(
      dataByIdLoaders.shoppingListItemLoader
    ),
    shoppingListItemCountLoader: shoppingListItemCountLoader(),
    recipeCountLoader: recipeCountLoader(),
    recipeByQueryLoader: recipeByQueryLoader(dataByIdLoaders.recipeLoader),
    recipeSourceByQueryLoader: recipeSourceByQueryLoader(
      dataByIdLoaders.recipeSourceLoader
    ),
    recipeSourceCountLoader: recipeSourceCountLoader(),
    savedRecipeByQueryLoader: savedRecipeByQueryLoader(),
    savedRecipeCountLoader: savedRecipeCountLoader(),
    followershipByQueryLoader: followershipByQueryLoader(),
    followershipCountLoader: followershipCountLoader(),
    commentByQueryLoader: commentByQueryLoader(dataByIdLoaders.commentLoader),
    commentCountLoader: commentCountLoader(),
    commentReactionByQueryLoader: commentReactionByQueryLoader(),
    commentReactionCountLoader: commentReactionCountLoader(),
    abuseReportByQueryLoader: abuseReportByQueryLoader(
      dataByIdLoaders.abuseReportLoader
    ),
    abuseReportCountLoader: abuseReportCountLoader(),
    notificationByQueryLoader: notificationByQueryLoader(
      dataByIdLoaders.notificationLoader
    ),
    notificationCountLoader: notificationCountLoader()
  }
}
export default createDataLoaders
