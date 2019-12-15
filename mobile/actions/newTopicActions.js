const server = require('../lib/server');

const createTopic = (navigation, groupId, name) => async (/* dispatch, getState */) => {
  const topicName = name;
  await server.createTopic({ topicName, groupId });
  navigation.goBack();
}

module.exports = {
  createTopic,
};
