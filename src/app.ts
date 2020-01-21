import express from 'express'
import helmet from 'helmet'

import { connectMongodb, i18nextHandler } from './config'
import { authMiddleware } from './middlewares'
import { i18n } from './utils'

/**
 * Express server instance
 */
const app = express()

// connect to the database
connectMongodb()

// secure apps by setting various HTTP headers
app.use(helmet())

// auth middleware
app.use(authMiddleware.checkIfAuthenticated)

// i18n middleware
app.use(i18nextHandler, (req, res, next) => {
  i18n.currentLanguage = req.language as any
  i18n.t = req.t
  next()
})

export default app
