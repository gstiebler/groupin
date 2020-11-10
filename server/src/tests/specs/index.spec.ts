/* eslint-disable import/no-extraneous-dependencies */
import { graphql } from 'graphql';

import * as sinon from 'sinon';
import * as chai from 'chai';
import * as dotenv from 'dotenv';
import rootValue from '../../resolver';
import * as mongooseConfig from '../../config/mongoose';
import schema from '../../graphqlSchema';
import logger from '../../config/winston';
import addMongooseLogger from '../../dev/mongodbLogger';
import User from '../../db/schema/User';

const graphqlConnect = require('../../../../mobile/lib/graphqlConnect');

const currentUserHolder = { currentUser: null };

function setCurrentUser(user) {
  currentUserHolder.currentUser = user;
}

if (process.env.NODE_ENV !== 'test') {
  throw new Error(`Tests are only allowed to run when in test environment. 
      Current environment: ${process.env.NODE_ENV}`);
}

before(async () => {
  dotenv.config();
  await mongooseConfig.init();
  sinon.stub(graphqlConnect, 'sendQuery').callsFake(async (query, variables) => {
    const user = await User.findById(currentUserHolder.currentUser._id);
    const firebaseId = 'dk49sdfjhk';
    const phoneNumber = '(21)999995555';
    const result = await graphql(schema, query, rootValue, { user, firebaseId, phoneNumber }, variables);
    if (result.errors) {
      for (const error of result.errors) {
        logger.error(error.stack);
      }
      throw new Error(result.errors[0].stack);
    }
    return result.data;
  });
  addMongooseLogger();
});

after(async () => {
  await mongooseConfig.disconnect();
});

module.exports = {
  setCurrentUser,
};
