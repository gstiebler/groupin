import * as server  from '../lib/server';

const createTopic = async (navigation, groupId, name) => {
  const topicName = name;
  await server.createTopic({ topicName, groupId });
  navigation.goBack();
}

module.exports = {
  createTopic,
};
