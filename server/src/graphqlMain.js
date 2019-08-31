const admin = require('firebase-admin');
const { graphql } = require('graphql');
const schema = require('./graphqlSchema');
const logger = require('./config/winston');
const User = require('./db/schema/User');
const _ = require('lodash');

async function main(graphqlQuery, authFbToken) {
  try {
    // TODO: return only basic fields from the user, review all places that reads user.groups
    let user = null;
    // *** used at register
    let phoneNumber = null;
    let firebaseId = null;
    // ***
    logger.debug(`Firebase auth token: ${authFbToken}`);
    if (authFbToken) {
      // authFbToken comes from the client app  
      const decodedToken = await admin.auth().verifyIdToken(authFbToken);
      logger.debug(decodedToken);
      firebaseId = decodedToken.uid;
      phoneNumber = decodedToken.phone_number;
      user = _.isEmpty(firebaseId) ? null : await User.findOne({ uid: firebaseId });
    }
    const result = await graphql(schema, graphqlQuery, null, { user, firebaseId, phoneNumber });
    return result;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { 
  main,
};
