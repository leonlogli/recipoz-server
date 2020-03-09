import { Request as BaseRequest, Response } from 'express'

import { AuthenticationError, DataLoaders } from '../utils'
import { Role } from '../models'
import createDataLoaders from './dataloaders'

export type Request = BaseRequest & {
  accountId?: string
  accesToken?: string
  error?: Error
  userRoles?: Role[]
}

export type Context = Pick<
  Request,
  'accountId' | 'accesToken' | 'error' | 'userRoles'
> & {
  isAdmin: boolean
  /**
   * Require user authentification before accessing the requested resource
   */
  requireAuth: () => void
  dataLoaders: DataLoaders
}

type ExpressContext = {
  req: Request
  res: Response
}

const context = ({ req }: ExpressContext): Context => {
  const { accesToken, error, accountId, userRoles } = req
  const isAdmin = userRoles?.includes('ADMIN') || false

  const requireAuth = () => {
    if (!accountId) {
      throw new AuthenticationError()
    }

    if (error) {
      throw error
    }
  }

  const dataLoaders = createDataLoaders()

  // add the user and other data to the context
  return {
    accountId,
    userRoles,
    error,
    isAdmin,
    accesToken,
    requireAuth,
    dataLoaders
  }
}

export default context
export { context }
