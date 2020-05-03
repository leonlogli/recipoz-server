import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection } from 'mongoose'
import {
  createTestClient,
  TestQuery,
  TestSetOptions
} from 'apollo-server-integration-testing'
import { DocumentNode } from 'graphql'

import { apolloServer } from '../..'
import { connectDb } from '../../config'
import { Context } from '../../graphql'
import { NODE } from './category/graph'

type TestingClient = {
  query: TestQuery
  mutate: TestQuery
  setOptions: TestSetOptions
  setContext: (context: Partial<Context>) => TestingClient
  useMutation: (
    mutation: DocumentNode,
    input: Record<string, any>,
    ctx?: Partial<Context>
  ) => Promise<any>
  useQuery: (
    query: DocumentNode,
    variables?: Record<string, any>,
    ctx?: Partial<Context>
  ) => Promise<any>
  queryNode: (globalId: string, ctx?: Partial<Context>) => Promise<any>
}

let mongoServer: MongoMemoryServer
let connection: Connection
const apolloClient: TestingClient = {} as any

const setContext = (context: Partial<Context>) => {
  apolloClient.setOptions({ request: { ...context } })

  return apolloClient
}

const useMutation = async (
  mutation: DocumentNode,
  input: Record<string, any>,
  ctx?: Partial<Context>
) => {
  const { mutate } = ctx ? apolloClient.setContext(ctx) : apolloClient

  return mutate(mutation, { variables: { input } })
}

const useQuery = async (
  query: DocumentNode,
  variables?: Record<string, any>,
  ctx?: Partial<Context>
) => {
  const { query: q } = ctx ? apolloClient.setContext(ctx) : apolloClient

  return q(query, { variables })
}

const queryNode = async (globalId: string, ctx?: Partial<Context>) => {
  return apolloClient.useQuery(NODE, { id: globalId }, ctx)
}

// Initialize apollo testing client to run queries and mutations
// against our instance of production ApolloServer
const initApolloClient = () => {
  const { query, mutate, setOptions } = createTestClient({
    apolloServer
  } as any)

  apolloClient.query = query
  apolloClient.mutate = mutate
  apolloClient.setOptions = setOptions
  apolloClient.setContext = setContext
  apolloClient.useMutation = useMutation
  apolloClient.useQuery = useQuery
  apolloClient.queryNode = queryNode

  return apolloClient
}

// Connect to a new in-memory/real test database before running any tests.
before(async () => {
  mongoServer = new MongoMemoryServer()
  const uri = await mongoServer.getUri()

  connection = (await connectDb(uri)) as Connection

  await Promise.all(
    Object.values(connection.models).map(m => m.createIndexes())
  )

  initApolloClient()
})

// Clear all test data after every test.
afterEach(async () => {
  const { collections } = connection

  await Promise.all(Object.values(collections).map(c => c.deleteMany({})))
})

// Remove and close the db and server after all test.
after(async () => {
  await connection.dropDatabase()
  await connection.close()

  if (mongoServer) {
    await mongoServer.stop()
  }
})

export { apolloClient as client }
