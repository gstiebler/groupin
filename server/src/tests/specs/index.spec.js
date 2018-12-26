const sinon = require('sinon');
const mongooseConfig = require('../../config/mongoose');
const graphqlConnect = require('../../../../mobile/lib/graphqlConnect');
const graphqlMain = require('../../graphqlMain');
const logger = require('../../config/winston');

let currentUserHolder = { currentUser: null };

function setCurrentUser(user) {
  currentUserHolder.currentUser = user;
}

before(async () => {
  require('dotenv').config();
  await mongooseConfig.init();
  sinon.stub(graphqlConnect, 'sendQuery').callsFake(async (query) => {
    try {
      const result = await graphqlMain.main(query, currentUserHolder.currentUser.token);
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
