import express from 'express'
import helmet from 'helmet'

import { i18nextHandler, connectDb } from './config'
import middlewares from './middlewares'

/**
 * Express server instance
 */
const app = express()

// connect to the database
connectDb()

// secure apps by setting various HTTP headers
app.use(helmet())

// apply i18nnext middleware before custom middlewares
app.use(i18nextHandler)

app.use(middlewares)

export default app
