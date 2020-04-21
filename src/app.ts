import express from 'express'
import helmet from 'helmet'

import { i18nextHandler, connectDb } from './config'
import { authMiddleware, i18nMiddleware } from './middlewares'

/**
 * Express server instance
 */
const app = express()

// connect to the database and starts tasks scheduling
connectDb()

// secure apps by setting various HTTP headers
app.use(helmet())

// auth middleware
app.use(authMiddleware.checkIfAuthenticated)

// i18n middleware
app.use(i18nextHandler, i18nMiddleware.localeDectector)

export default app
