import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { graphql } from 'graphql';
import rootValue from '../resolvers/rootResolver';
import schema from '../graphqlSchema';
import logger from '../config/winston';
import User from '../db/schema/User';

import * as graphqlConnect from '../../../mobile/lib/graphqlConnect';

const currentUserHolder = { currentUser: null };

export function setCurrentUser(user) {
  currentUserHolder.currentUser = user;
}

if (process.env.NODE_ENV !== 'test') {
  throw new Error(`Tests are only allowed to run when in test environment. 
      Current environment: ${process.env.NODE_ENV}`);
}

const mongooseInitPromise = mongooseConfig.init();
export async function setup() {
  await mongooseInitPromise;
  graphqlConnect.sendQuery = async (query, variables) => {
    const user = await User.findById(currentUserHolder.currentUser._id);
    const firebaseId = 'dk49sdfjhk';
    const phoneNumber = '(21)999995555';
    const result = await graphql(schema, query, rootValue, { user, firebaseId, phoneNumber }, variables);
    if (result.errors) {
      for (const error of result.errors) {
        logger.error(error.stack);
      }
      throw new Error(result.errors[0].message);
    }
    return result.data;
  };
}
