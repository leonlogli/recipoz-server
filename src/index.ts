import { ApolloServer } from 'apollo-server-express'

import { PORT, NODE_ENV, logger } from './config'
import { typeDefs, resolvers, context } from './graphql'
import app from './app'

// Setup GraphQL Apollo server.
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context
})

apolloServer.applyMiddleware({ app })

// Start app server
app.listen(PORT, () => {
  logger.info(
    `App is running at http://localhost:${PORT}${apolloServer.graphqlPath} in ${NODE_ENV} mode`
  )
})

export { apolloServer }
