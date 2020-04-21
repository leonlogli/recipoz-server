import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'

import { JWT, logger } from '../config'
import { DecodedAccessToken } from '../models'

const extractAccessToken = (req: any, _res: Response, next: NextFunction) => {
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
      const payload = jwt.verify(
        req.accessToken,
        JWT.SECRET
      ) as DecodedAccessToken

      req.accountId = payload.id
      req.userRoles = payload.roles
    } catch (error) {
      logger.error('Error checking authentication: ', error)
    }

    return next()
  })
}

const authMiddleware = { checkIfAuthenticated }

export default authMiddleware
export { authMiddleware }
