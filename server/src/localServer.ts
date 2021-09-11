import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import pushService from './lib/pushService';
import { ApolloServer } from 'apollo-server';
import { getContext } from './graphqlContext';
import schema from './buildSchema';
import logger from './config/winston';

pushService.init();

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    return getContext(req.headers.authorization ?? '');
  }
});

server.listen().then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`);
});
