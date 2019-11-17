const { graphql } = require('graphql');
const sinon = require('sinon');
const mongooseConfig = require('../../config/mongoose');
const User = require('../../db/schema/User');
const graphqlConnect = require('../../../../mobile/lib/graphqlConnect');
const schema = require('../../graphqlSchema');
const logger = require('../../config/winston');
const { addMongooseLogger } = require('../../dev/mongodbLogger');

const chai = require('chai');
const chaiSubset = require('chai-subset');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiSubset);
chai.use(chaiAsPromised);

let currentUserHolder = { currentUser: null };

function setCurrentUser(user) {
  currentUserHolder.currentUser = user;
}

if (process.env.NODE_ENV !== 'test') {
  throw new Error(`Tests are only allowed to run when in test environment. 
      Current environment: ${process.env.NODE_ENV}`);
}

before(async () => {
  require('dotenv').config();
  await mongooseConfig.init();
  sinon.stub(graphqlConnect, 'sendQuery').callsFake(async (query) => {
    const user = await User.findById(currentUserHolder.currentUser._id);
    const firebaseId = 'dk49sdfjhk';
    const phoneNumber = '(21)999995555';
    const result = await graphql(schema, query, null, { user, firebaseId, phoneNumber });
    if (result.errors) {
      for (const error of result.errors) {
        logger.debug(error.stack);
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
