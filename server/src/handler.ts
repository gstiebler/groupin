import dotenv from 'dotenv';
dotenv.config();
import pushService from './lib/pushService';
import { ApolloServer } from 'apollo-server-azure-functions';
import { RootResolver } from './resolvers/rootResolver';
import { buildSchema } from 'type-graphql'
import { getContext } from './graphqlMain';


pushService.init();

const schema = await buildSchema({
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
