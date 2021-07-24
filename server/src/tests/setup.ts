import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import logger from '../config/winston';
import { createConnectionContext } from '../db/ConnectionContext';
import { User } from '../db/entity/User.entity';
import { Context } from '../graphqlContext';
import schema from './../buildSchema';
import { ApolloServer } from 'apollo-server';
import { VariableValues } from 'apollo-server-types';

const currentUserHolder: { currentUser?: Partial<User> } = { currentUser: undefined };

export function setCurrentUser(user: Partial<User>) {
  currentUserHolder.currentUser = user;
}

if (process.env.NODE_ENV !== 'test') {
  throw new Error(`Tests are only allowed to run when in test environment. 
      Current environment: ${process.env.NODE_ENV}`);
}

export const connnectionContextPromise = createConnectionContext({
  host: 'localhost',
  database: 'groupin_test',
});

export async function setup() {
  const connectionContext = await connnectionContextPromise;

  const server = new ApolloServer({
    schema,
    context: async (): Promise<Context> => {
      const user = await connectionContext.userRepository.findOne(currentUserHolder.currentUser?.id);
      return { user, externalId: 'dk49sdfjhk', db: connectionContext };
    },
  });

  graphqlConnect.sendQuery = async (query: string, variables?: VariableValues) => {
    const result = await server.executeOperation({
      query,
      variables,
    });
    if (result.errors) {
      for (const error of result.errors) {
        logger.error(error.locations);
      }
      throw new Error(result.errors[0].message);
    }
    return result.data;
  };
}

