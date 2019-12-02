import express from 'express'
import helmet from 'helmet'

import { connectMongodb } from './config'
import { authMiddleware } from './middlewares'

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

export default app
