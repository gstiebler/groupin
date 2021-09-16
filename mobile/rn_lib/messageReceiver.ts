import { GroupStore } from "../stores/groupStore";
import { TopicStore } from "../stores/topicStore";
import { NotificationProcessingParams } from "./notificationTypes";

export async function messageReceived(groupStore: GroupStore, topicStore: TopicStore) {
  await Promise.all([
    groupStore.getTopicsOfCurrentGroup(),
    topicStore.fetchMessagesOfCurrentTopic(),
  ]);
}

async function onNewNotification(notificationParams: NotificationProcessingParams) {
  const { groupStore, topicStore, navigation } = notificationParams;
  const { groupId, topicId, topicName, type } = notificationParams.notificationData;
  groupStore.setCurrentlyViewedGroup(groupId);
  topicStore.setCurrentViewedTopicId(topicId);
  
  await messageReceived(groupStore, topicStore);

  if (type === 'NEW_MESSAGE') {
    // TODO: focus on the received message
    navigation.navigate('Chat', { topicId, topicName });
  } else if (type === 'NEW_TOPIC') {
    navigation.navigate('Chat', { topicId, topicName });
  } else {
    throw new Error(`Invalid message type: ${type}`);
  }
}

export async function onNotificationOpened(notificationParams: NotificationProcessingParams) {
  onNewNotification(notificationParams);
}

export async function onInitialNotification(notificationParams: NotificationProcessingParams) {
  onNewNotification(notificationParams);
}
