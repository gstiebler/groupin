const admin = require('firebase-admin');
const { graphql } = require('graphql');
const schema = require('./graphqlSchema');
const logger = require('./config/winston');
const User = require('./db/schema/User');
const _ = require('lodash');

async function main(graphqlQuery, firebaseToken) {
  // TODO: return only basic fields from the user, review all places that reads user.groups
  let user = null;
  if (firebaseToken) {
    user = await User.findOne({ fcmToken: firebaseToken });
    if (!user) {
      // idToken comes from the client app  
      const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
      const uid = decodedToken.uid;
      user = _.isEmpty(uid) ? null : await User.findOne({ uid });
    }
  }
  const result = await graphql(schema, graphqlQuery, null, { user });
  return result;
}

module.exports = { 
  main,
};
