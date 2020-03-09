import accountLoader from './accountLoader'
import { DataLoaders } from '../../utils'
import {
  categoryLoader,
  categoryByQueryLoader,
  categoryCountLoader
} from './categoryLoader'
import notificationLoader from './notificationLoader'
import recipeLoader from './recipeLoader'
import {
  recipeSourceLoader,
  recipeSourceByQueryLoader,
  recipeSourceCountLoader
} from './recipeSourceLoader'
import userLoader from './userLoader'
import trackingLoader from './trackingLoader'

/**
 * Returns a function that creates all dataloaders. Dataloaders must be created in the
 * context (to ensure new instance on each request). So instead of instanciating them
 * direactly, it is recommanded to return a function that will create them when called
 */
export const createDataLoaders = (): DataLoaders => {
  return {
    accountLoader: accountLoader(),
    categoryLoader: categoryLoader(),
    categoryByQueryLoader: categoryByQueryLoader(),
    categoryCountLoader: categoryCountLoader(),
    notificationLoader: notificationLoader(),
    recipeLoader: recipeLoader(),
    recipeSourceLoader: recipeSourceLoader(),
    recipeCountLoader: recipeSourceCountLoader(),
    recipeSourceByQueryLoader: recipeSourceByQueryLoader(),
    userLoader: userLoader(),
    trackingLoader: trackingLoader()
  }
}
export default createDataLoaders
