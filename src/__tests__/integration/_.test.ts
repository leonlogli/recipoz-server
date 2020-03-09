import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection } from 'mongoose'
import {
  createTestClient,
  TestQuery,
  TestSetOptions
} from 'apollo-server-integration-testing'

import { apolloServer } from '../..'
import { connectMongodb, USE_MEMORY_TEST_DB, MONGO } from '../../config'

let mongoServer: MongoMemoryServer
let connection: Connection

const apolloClient = {
  query: {} as TestQuery,
  mutate: {} as TestQuery,
  setOptions: {} as TestSetOptions
}

/**
 * Connect to a new in-memory/real test database before running any tests.
 */
before(async () => {
  let mongoUri

  if (USE_MEMORY_TEST_DB) {
    mongoServer = new MongoMemoryServer()

    mongoUri = await mongoServer.getUri()
  } else mongoUri = MONGO.URI

  connection = await connectMongodb(mongoUri)

  if (USE_MEMORY_TEST_DB) {
    // create indexes because they are not created with in this in-memory db
    await Promise.all(
      Object.values(connection.models).map(m => m.createIndexes())
    )
  }

  const { query, mutate, setOptions } = createTestClient({
    apolloServer
  } as any)

  apolloClient.query = query
  apolloClient.mutate = mutate
  apolloClient.setOptions = setOptions
})

/**
 * Clear all test data after every test.
 */
afterEach(async () => {
  const collections = USE_MEMORY_TEST_DB
    ? connection.collections
    : await connection.db.collections()

  await Promise.all(Object.values(collections).map(c => c.deleteMany({})))
})

/**
 * Remove and close the db and server after all test.
 */
after(async () => {
  await connection.dropDatabase()
  await connection.close()
  if (mongoServer) {
    await mongoServer.stop()
  }
})

export { apolloClient }
