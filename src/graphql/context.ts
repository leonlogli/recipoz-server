import { Request as BaseRequest, Response } from 'express'

import { Role } from '../models'

export type Request = BaseRequest & {
  userId: string
  accesToken?: string
  error?: Error
  userRoles?: Role[]
}

type ExpressContext = {
  req: Request
  res: Response
}

const context = ({ req }: ExpressContext) => {
  const { accesToken, error, userId, userRoles } = req

  // add the user and other data to the context
  return { userId, userRoles, error, accesToken }
}

export default context
