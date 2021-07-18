import { RootStore } from '../stores/rootStore';
import { Navigation } from '../rn_lib/Navigator.types';


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
  navigation: Navigation;
  groupId: string;
  topicId: string;
  topicName: string;
  rootStore: RootStore;
}) {
  const { navigation, groupId, topicId, topicName, rootStore } = params;
  rootStore.setCurrentlyViewedGroup(groupId);
  rootStore.setCurrentViewedTopicId(topicId);

  navigation.navigate('Chat', { topicId, topicName });
  
  await messageReceived(rootStore);
}

export async function onNotificationOpened(navigation: Navigation, notificationOpen: GiNotification, rootStore: RootStore) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    navigation,
    groupId, 
    topicId,
    topicName,
    rootStore,
  });
}

export async function onInitialNotification(navigation: Navigation, notificationOpen: GiNotification, rootStore: RootStore) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    navigation,
    groupId, 
    topicId,
    topicName,
    rootStore,
  });
}
