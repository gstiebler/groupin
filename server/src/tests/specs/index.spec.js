const sinon = require('sinon');
const mongooseConfig = require('../../config/mongoose');
const graphqlConnect = require('../../../../mobile/lib/graphqlConnect');
const graphqlMain = require('../../lib/graphqlMain');
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
      const result = await graphqlMain.main(query, currentUser.token);
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
