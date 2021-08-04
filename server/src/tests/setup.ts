import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

// import logger from '../config/winston';
import { createConnectionContext } from '../db/ConnectionContext';
import { Context } from '../graphqlContext';
import schema from './../buildSchema';
import graphqlConnect from '../mobile/lib/graphqlConnect';
import { ApolloServer } from 'apollo-server';
import { VariableValues } from 'apollo-server-types';
import { GraphQLError } from 'graphql';
import { IUser } from '../db/schema/User';

const currentUserHolder: { currentUser?: Partial<IUser> } = { currentUser: undefined };

export function setCurrentUser(user: Partial<IUser>) {
  currentUserHolder.currentUser = user;
}

if (process.env.NODE_ENV !== 'test') {
  throw new Error(`Tests are only allowed to run when in test environment. 
      Current environment: ${process.env.NODE_ENV}`);
}

export const connnectionContextPromise = createConnectionContext();

async function setup() {
  const connectionContext = await connnectionContextPromise;

  const server = new ApolloServer({
    schema,
    context: (): Context => {
      return { user: currentUserHolder.currentUser as IUser, externalId: 'dk49sdfjhk', db: connectionContext };
    },
  });

  graphqlConnect.sendQuery = async (query: string, variables?: VariableValues) => {
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
