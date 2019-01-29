import * as server from '../lib/server';

export const createTopic = (navigation, groupId) => async (dispatch, getState) => {
  const topicName = getState().newTopic.name;
  await server.createTopic({ topicName, groupId });
  navigation.goBack();
}
