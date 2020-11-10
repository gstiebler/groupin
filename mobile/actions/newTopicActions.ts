import * as server from '../lib/server';

export const createTopic = (navigation, groupId, name) => async (/* dispatch, getState */) => {
  const topicName = name;
  await server.createTopic({ topicName, groupId });
  navigation.goBack();
}
