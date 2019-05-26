const server = require('../lib/server');

const createTopic = (navigation, groupId) => async (dispatch, getState) => {
  const topicName = getState().newTopic.name;
  await server.createTopic({ topicName, groupId });
  navigation.goBack();
}

module.exports = {
  createTopic,
};
