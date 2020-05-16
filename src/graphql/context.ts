import { Request as BaseRequest, Response } from 'express'
import { ADMIN } from '../constants'
import { Role } from '../models'
import { AuthenticationError, DataLoaders, isValidObjectId } from '../utils'
import { createDataLoaders } from './dataloaders'

export type Request = BaseRequest & {
  /**
   * The current user account id. It is a local id (objectId), so can be used
   * directly within resolvers without any conversion
   */
  accountId?: string
  /**
   * The provided access Token
   */
  accessToken?: string
  /**
   * Internal Server Error thrown in middlewares
   */
  error?: Error
  /**
   * The current user roles
   */
  userRoles?: Role[]
}

export type Context = Pick<Request, 'accountId' | 'userRoles' | 'error'> & {
  /**
   * Indicates whether the current user has `ADMIN` role
   */
  isAdmin: boolean
  /**
   * Indicates whether the current user is authenticated
   */
  isAuth: boolean
  /**
   * Require user authentification before accessing the requested resource.
   * Unauthenticated error is thrown if the user is not authenticated.
   */
  requireAuth: () => void | Error
  /**
   * All instantiated data loaders
   */
  dataLoaders: DataLoaders
}

type ExpressContext = {
  req: Request
  res: Response
}

const context = ({ req }: ExpressContext): Context => {
  const { error, accountId, userRoles } = req
  const isAdmin = userRoles?.includes(ADMIN) || false
  const dataLoaders = createDataLoaders()

  const isAuth = isValidObjectId(accountId)

  const requireAuth = () => {
    if (!isAuth) {
      throw new AuthenticationError()
    }
  }

  return {
    accountId,
    userRoles,
    isAdmin,
    requireAuth,
    isAuth,
    dataLoaders,
    error
  }
}

export default context
export { context }
