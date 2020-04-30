import { ApolloServer } from 'apollo-server-express'

import { PORT, NODE_ENV, logger, APOLLO_KEY } from './config'
import { typeDefs, resolvers, context, schemaDirectives } from './graphql'
import app from './app'
import { formatError } from './utils'

/**
 * Apollo graphQL production-ready server
 */
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  schemaDirectives,
  engine: {
    apiKey: APOLLO_KEY,
    schemaTag: 'production'
  },
  formatError
})

apolloServer.applyMiddleware({ app })

// Start app server
app.listen(PORT, () => {
  logger.info(
    `App is running at http://localhost:${PORT}${apolloServer.graphqlPath} in ${NODE_ENV} mode`
  )
})

export { apolloServer }
