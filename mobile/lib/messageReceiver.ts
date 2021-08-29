import { GroupStore } from "../stores/groupStore";
import { TopicStore } from "../stores/topicStore";

export type GiNotification = {
  notification: {
    data: {
      groupId: string;
      topicId: string;
      topicName: string
    }
  }
}

export async function messageReceived(groupStore: GroupStore, topicStore: TopicStore) {
  await Promise.all([
    groupStore.getTopicsOfCurrentGroup(),
    topicStore.getMessagesOfCurrentTopic(),
  ]);
}

async function onNewNotification(params: {
  groupId: string;
  topicId: string;
  groupStore: GroupStore;
  topicStore: TopicStore;
}) {
  const { groupId, topicId, groupStore, topicStore } = params;
  groupStore.setCurrentlyViewedGroup(groupId);
  topicStore.setCurrentViewedTopicId(topicId);
  
  await messageReceived(groupStore, topicStore);
}

export async function onNotificationOpened(notificationOpen: GiNotification, groupStore: GroupStore, topicStore: TopicStore) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    groupId, 
    topicId,
    groupStore,
    topicStore,
  });
}

export async function onInitialNotification(notificationOpen: GiNotification, groupStore: GroupStore, topicStore: TopicStore) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    groupId, 
    topicId,
    groupStore,
    topicStore,
  });
}
