import * as dotenv from 'dotenv';
dotenv.config({ path: process.cwd() + '/.env.test' });

import 'reflect-metadata';

// import logger from '../config/winston';
import { createConnectionContext } from '../db/ConnectionContext';
import { Context } from '../graphqlContext';
import schema from './../buildSchema';
import graphqlConnect from '../mobile/lib/graphqlConnect';
import { ApolloServer } from 'apollo-server';
import { VariableValues } from 'apollo-server-types';
import { GraphQLError } from 'graphql';
import { User } from '../db/schema/User';
import { envConfig } from '../config/envConfig';

const currentUserHolder: { currentUser: Partial<User> | null } = { currentUser: null };

export function setCurrentUser(user: Partial<User> | null) {
  currentUserHolder.currentUser = user;
}

if (envConfig.NODE_ENV !== 'test') {
  throw new Error(`Tests are only allowed to run when in test environment. 
      Current environment: ${envConfig.NODE_ENV}`);
}

export const connnectionContextPromise = createConnectionContext();

async function setup() {
  const connectionContext = await connnectionContextPromise;

  const server = new ApolloServer({
    schema,
    context: (): Context => {
      return { userId: currentUserHolder.currentUser?._id?.toHexString(), externalId: 'dk49sdfjhk', db: connectionContext };
    },
  });

  graphqlConnect.sendQuery = async (query: string, variables?: VariableValues) => {
    // logger.debug(query, variables);
    const result = await server.executeOperation({
      query,
      variables,
    });
    if (result.errors) {
      const mainError = result.errors[0] as GraphQLError;
      throw mainError.originalError;
    }
    return result.data;
  };
}

beforeAll(async () => {
  await setup();
});

afterAll(async () => {
  const connectionContext = await connnectionContextPromise;
  await connectionContext.connection.disconnect();
});
