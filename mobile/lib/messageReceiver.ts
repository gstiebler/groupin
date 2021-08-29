import { groupStore, topicStore } from '../rn_lib/storesFactory';
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

export async function messageReceived() {
  await Promise.all([
    groupStore.getTopicsOfCurrentGroup(),
    topicStore.getMessagesOfCurrentTopic(),
  ]);
}

async function onNewNotification(params: {
  groupId: string;
  topicId: string;
  topicName: string;
}) {
  const { groupId, topicId } = params;
  groupStore.setCurrentlyViewedGroup(groupId);
  topicStore.setCurrentViewedTopicId(topicId);
  
  await messageReceived();
}

export async function onNotificationOpened(notificationOpen: GiNotification) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    groupId, 
    topicId,
    topicName,
  });
}

export async function onInitialNotification(notificationOpen: GiNotification) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    groupId, 
    topicId,
    topicName,
  });
}
