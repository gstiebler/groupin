import { GraphQLServer } from 'graphql-yoga'
import { buildSchemaSync } from 'type-graphql';
import { getContext } from './graphqlContext';
import { RootResolver } from './resolvers/rootResolver';

const schema = buildSchemaSync({
  resolvers: [RootResolver],
  emitSchemaFile: true,
});

const server = new GraphQLServer({
  schema,
  context: (params) => {
    return getContext(params.request.headers.authorization ?? '');
  } })
server.start(() => console.log('Server is running on localhost:4000'))
