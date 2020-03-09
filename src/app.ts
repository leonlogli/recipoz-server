import express from 'express'
import helmet from 'helmet'

import { connectDb, i18nextHandler, startAgenda } from './config'
import { authMiddleware, i18nMiddleware } from './middlewares'

/**
 * Express server instance
 */
const app = express()

// connect to the database and starts tasks scheduling
connectDb().then(connection => startAgenda(connection))

// secure apps by setting various HTTP headers
app.use(helmet())

// auth middleware
app.use(authMiddleware.checkIfAuthenticated)

// i18n middleware
app.use(i18nextHandler, i18nMiddleware.localeDectector)

export default app
