import * as storage from './localStorage';
import { rootStore } from '../stores/storesFactory';
import { NavFn } from '../components/Navigator';


export async function messageReceived(message?) {
  await Promise.all([
    rootStore.getTopicsOfCurrentGroup(),
    rootStore.getMessagesOfCurrentTopic(storage),
  ]);
}

async function onNewNotification(params: {
  navigateFn: NavFn;
  groupId: string;
  topicId: string;
  topicName: string;
}) {
  const { navigateFn, groupId, topicId, topicName } = params;
  rootStore.setCurrentlyViewedGroup(groupId);
  rootStore.setCurrentViewedTopicId(topicId);

  // TODO: push topic list screen
  // navigation.navigate('TopicsList', { groupId, groupName });
  navigateFn('Chat', { topicId: topicId, topicName: topicName });
  
  await messageReceived();
}

export async function onNotificationOpened(navigateFn: NavFn, notificationOpen) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    navigateFn,
    groupId, 
    topicId,
    topicName,
  });
}

export async function onInitialNotification(navigateFn: NavFn, notificationOpen) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    navigateFn,
    groupId, 
    topicId,
    topicName,
  });
}
