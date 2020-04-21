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

// print mongoose logs only in dev env
mongoose.set('debug', DEV_ENV)

/**
 * Connect to mongo db
 * @param uri Mongodb uri
 */
const connectDb = async (uri = MONGO.URI) => {
  return mongoose
    .connect(uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(m => m.connection)
}

export { connectDb }
export default connectDb
