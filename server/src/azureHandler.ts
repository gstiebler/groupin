import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import pushService from './lib/pushService';
import { ApolloServer } from 'apollo-server-azure-functions';
import { getContext } from './graphqlContext';
import schema from './buildSchema';

pushService.init();

const server = new ApolloServer({ 
  schema,
  context: ({ req }) => {
    return getContext(req.headers.authorization);
  }
});
const handler = server.createHandler();
export default handler;
