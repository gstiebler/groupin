import { RootStore } from '../stores/rootStore';

export type GiNotification = {
  notification: {
    data: {
      groupId: string;
      topicId: string;
      topicName: string
    }
  }
}

export async function messageReceived(rootStore: RootStore) {
  await Promise.all([
    rootStore.getTopicsOfCurrentGroup(),
    rootStore.getMessagesOfCurrentTopic(),
  ]);
}

async function onNewNotification(params: {
  groupId: string;
  topicId: string;
  topicName: string;
  rootStore: RootStore;
}) {
  const { groupId, topicId, rootStore } = params;
  rootStore.setCurrentlyViewedGroup(groupId);
  rootStore.setCurrentViewedTopicId(topicId);
  
  await messageReceived(rootStore);
}

export async function onNotificationOpened(notificationOpen: GiNotification, rootStore: RootStore) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    groupId, 
    topicId,
    topicName,
    rootStore,
  });
}

export async function onInitialNotification(notificationOpen: GiNotification, rootStore: RootStore) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    groupId, 
    topicId,
    topicName,
    rootStore,
  });
}
