import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import pushService from './lib/pushService';
import { ApolloServer } from 'apollo-server';
import { getContext } from './graphqlContext';
import schema from './buildSchema';
import logger from './config/winston';
import { envConfig } from './config/envConfig';

pushService.init();

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    return getContext(req.headers.authorization ?? '');
  }
});

server.listen({ port: envConfig.PORT }).then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`);
});
