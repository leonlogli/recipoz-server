import mongoose from 'mongoose'

import { MONGO, DEV_ENV } from './env'
import logger from './logger'

mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

// Exit application on error
mongoose.connection.on('error', (err: any) => {
  logger.error(`MongoDB connection error: ${err}`)
  process.exit(-1)
})

mongoose.connection.on('connected', () => {
  logger.info('Database connected successfully')
})

// print mongoose logs in dev env
if (DEV_ENV) {
  mongoose.set('debug', true)
}

/**
 * Connect to mongo db
 *
 * @returns {mongoose.Connection} Mongoose connection
 */
export const connectMongodb = () => {
  mongoose.connect(MONGO.URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })

  return mongoose.connection
}
