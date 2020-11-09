const admin = require('firebase-admin');
const { graphql } = require('graphql');
const _ = require('lodash');
const rootValue = require('./resolver');
const schema = require('./graphqlSchema');
const logger = require('./config/winston');
const User = require('./db/schema/User');

async function main({ query, variables }, authFbToken) {
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
