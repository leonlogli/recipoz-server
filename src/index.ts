import app from './app'

// Start app server
app.listen({ port: 4000 }, () =>
  console.log(
    `Server is running at http://localhost:${app.get('port')}${app.get(
      'graphqlPath'
    )} in ${app.get('node_env')} mode`
  )
)
