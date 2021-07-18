import * as dotenv from 'dotenv';
dotenv.config();
import pushService from './lib/pushService';
import { ApolloServer } from 'apollo-server-azure-functions';
import { RootResolver } from './resolvers/rootResolver';
import { getContext } from './graphqlContext';
import { buildSchemaSync } from 'type-graphql';

pushService.init();

const schema = buildSchemaSync({
  resolvers: [RootResolver],
  emitSchemaFile: true,
});
const server = new ApolloServer({ 
  schema,
  context: ({ req }) => {
    return getContext(req.headers.authorization);
  }
});
const handler = server.createHandler();
export default handler;
