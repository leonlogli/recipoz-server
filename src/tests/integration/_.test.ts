import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection } from 'mongoose'
import { connectMongodb, USE_MEMORY_TEST_DB, MONGO } from '../../config'

let mongod: MongoMemoryServer
let connection: Connection

/**
 * Connect to a new in-memory database before running any tests.
 */
before(async () => {
  let uri: string

  if (USE_MEMORY_TEST_DB) {
    mongod = new MongoMemoryServer()
    uri = await mongod.getConnectionString()
  } else uri = MONGO.URI

  connection = await connectMongodb(uri)
})

/**
 * Clear all test data after every test.
 */
afterEach(async () => {
  const { collections } = connection

  Object.values(collections).forEach(async collection => {
    await collection.deleteMany({})
  })
})

/**
 * Remove and close the db and server after all test.
 */
after(async () => {
  await connection.dropDatabase()
  await connection.close()
  if (mongod) {
    await mongod.stop()
  }
})
