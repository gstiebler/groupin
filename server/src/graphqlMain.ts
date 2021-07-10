import * as admin from 'firebase-admin';
import { graphql } from 'graphql';
import * as _ from 'lodash';
import rootValue from './resolver';
import schema from './graphqlSchema';
import logger from './config/winston';
import User from './db/schema/User';
import "reflect-metadata";

async function main({ query, variables }: { query: string, variables: unknown }, authFbToken: string) {
  try {
    // TODO: return only basic fields from the user, review all places that reads user.groups
    let user = null;
    // *** used at register
    let phoneNumber = null;
    let firebaseId = null;
    // ***
    if (authFbToken) {
      logger.debug(authFbToken);
      // authFbToken comes from the client app
      const decodedToken = await admin.auth().verifyIdToken(authFbToken);
      firebaseId = decodedToken.uid;
      phoneNumber = decodedToken.phone_number;
      user = _.isEmpty(firebaseId) ? null : await User.findOne({ uid: firebaseId });
    }
    const result = await graphql(schema, query, rootValue, { user, firebaseId, phoneNumber }, variables);
    logger.debug(JSON.stringify(query, null, 2));
    logger.debug(JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    logger.error(error);
    return -1;
  }
}

module.exports = {
  main,
};
