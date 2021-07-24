import { GraphQLServer } from 'graphql-yoga'
import { getContext } from './graphqlContext';
import schema from './buildSchema';

const server = new GraphQLServer({
  schema,
  context: (params) => getContext(params.request.headers.authorization ?? ''), 
})
server.start(() => console.log('Server is running on localhost:4000'))
