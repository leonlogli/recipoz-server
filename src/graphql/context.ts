import { Request as BaseRequest, Response } from 'express'
import { AuthenticationError } from 'apollo-server-express'

import { i18n } from '../utils'
import { errorMessages } from '../constants'
import { Role } from '../models'
import { userLoader } from './dataloaders'

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
  usersLoader: ReturnType<typeof userLoader>
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
      throw new AuthenticationError(i18n.t(errorMessages.unauthenticated))
    }
    if (error) {
      throw error
    }
  }

  // add the user and other data to the context
  return {
    accountId,
    userRoles,
    error,
    isAdmin,
    accesToken,
    requireAuth,
    usersLoader: userLoader()
  }
}

export default context
