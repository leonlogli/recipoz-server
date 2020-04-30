import jwt from 'jsonwebtoken'
import { Response, NextFunction } from 'express'

import { JWT } from '../config'
import { DecodedAccessToken } from '../models'

const extractAccessToken = (req: any) => {
  const { authorization } = req.headers
  const authArray = authorization ? authorization.split(' ') : []
  const hasToken = authArray[0] === 'Bearer' || authArray[0] === 'JWT'

  return hasToken ? authArray[1] : null
}

/**
 * Ensure there is a valid accessToken in the request header.
 */
const checkIfAuthenticated = (req: any, _res: Response, next: NextFunction) => {
  try {
    const accessToken = extractAccessToken(req)
    const payload = jwt.verify(accessToken, JWT.SECRET) as DecodedAccessToken

    req.accountId = payload.id
    req.userRoles = payload.roles
  } catch (error) {
    req.error = error
  }

  next()
}

const authMiddleware = { checkIfAuthenticated }

export default authMiddleware
export { authMiddleware }
