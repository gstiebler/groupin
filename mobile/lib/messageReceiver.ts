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
  store: any;
  groupId: string;
  topicId: string;
  topicName: string;
}) {
  rootStore.setCurrentlyViewedGroup(params.groupId);
  rootStore.setCurrentViewedTopicId(params.topicId);

  // TODO: push topic list screen
  // navigation.navigate('TopicsList', { groupId, groupName });
  params.navigateFn('Chat', { topicId: params.topicId, topicName: params.topicName });
  
  await messageReceived();
}

export async function onNotificationOpened(navigateFn, store, notificationOpen) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    navigateFn, 
    store, 
    groupId, 
    topicId,
    topicName,
  });
}

export async function onInitialNotification(navigateFn, store, notificationOpen) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    navigateFn, 
    store, 
    groupId, 
    topicId,
    topicName,
  });
}
