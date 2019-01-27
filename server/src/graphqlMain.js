const { graphql } = require('graphql');
const schema = require('./graphqlSchema');
const logger = require('./config/winston');
const User = require('./db/schema/User');
const _ = require('lodash');

async function main(graphqlQuery, userToken) {
  // TODO: return only basic fields from the user, review all places that reads user.groups
  const user = _.isEmpty(userToken) ? null : await User.findOne({ token: userToken });
  const result = await graphql(schema, graphqlQuery, null, { user });
  return result;
}

module.exports = { 
  main,
};
