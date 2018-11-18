const sinon = require('sinon');
const mongooseConfig = require('../../config/mongoose');
const graphqlConnect = require('../../../../mobile/lib/graphqlConnect');
const { graphql } = require('graphql');
const schema = require('../../graphqlSchema');
const logger = require('../../config/winston');

let currentUser;

function setCurrentUser(user) {
  currentUser = user;
}

before(async () => {
  require('dotenv').config();
  await mongooseConfig.init();
  sinon.stub(graphqlConnect, 'sendQuery').callsFake(async (query) => {
    try {
      const context = { user: currentUser };
      const result = await graphql(schema, query, null, context);
      if (result.errors) {
        for (const error of result.errors) {
          logger.error(error.stack);
        }
      } else {
        return result.data;
      }
    } catch(error) {
      logger.error(error);
    }
  });
});

after(async () => {
  await mongooseConfig.disconnect();
});

module.exports = {
  setCurrentUser,
};
