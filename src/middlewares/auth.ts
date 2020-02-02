import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-express'

import { JWT } from '../config'
import { errorMessages } from '../constants'
import { i18n } from '../utils'

const extractAccessToken = (req: any, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  const authArray = authorization ? authorization.split(' ') : []
  const hasToken = authArray[0] === 'Bearer' || authArray[0] === 'JWT'

  req.accessToken = hasToken ? authArray[1] : null
  next()
}

/**
 * Ensure there is a valid accessToken in the request header.
 */
const checkIfAuthenticated = (req: any, res: Response, next: NextFunction) => {
  extractAccessToken(req, res, async () => {
    try {
      const payload: any = jwt.verify(req.accessToken, JWT.SECRET)

      req.accountId = payload.id
      req.userRoles = payload.roles
    } catch (e) {
      req.error = new AuthenticationError(i18n.t(errorMessages.accessDenied))
    }

    return next()
  })
}

export default { checkIfAuthenticated }
