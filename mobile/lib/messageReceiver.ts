import { localStorage } from './localStorage';
import { rootStore } from '../stores/storesFactory';
import { NavFn } from '../components/Navigator';
import { GiNotification } from './fcm';

export async function messageReceived(message?: string) {
  await Promise.all([
    rootStore.getTopicsOfCurrentGroup(),
    rootStore.getMessagesOfCurrentTopic(localStorage),
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
  navigateFn('Chat', { topicId, topicName });
  
  await messageReceived();
}

export async function onNotificationOpened(navigateFn: NavFn, notificationOpen: GiNotification) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    navigateFn,
    groupId, 
    topicId,
    topicName,
  });
}

export async function onInitialNotification(navigateFn: NavFn, notificationOpen: GiNotification) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    navigateFn,
    groupId, 
    topicId,
    topicName,
  });
}
