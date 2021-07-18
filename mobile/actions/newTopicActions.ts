import { Navigation } from '../types/Navigator.types';
import * as server  from '../lib/server';

const createTopic = async (navigation: Navigation, groupId: string, name: string) => {
  const topicName = name;
  await server.createTopic({ topicName, groupId });
  navigation.goBack();
}

module.exports = {
  createTopic,
};
