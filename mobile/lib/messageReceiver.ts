import { localStorage } from './localStorage';
import { rootStore } from '../stores/storesFactory';
import { Navigation } from '../components/Navigator.types';


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
    rootStore.getTopicsOfCurrentGroup(),
    rootStore.getMessagesOfCurrentTopic(localStorage),
  ]);
}

async function onNewNotification(params: {
  navigation: Navigation;
  groupId: string;
  topicId: string;
  topicName: string;
}) {
  const { navigation, groupId, topicId, topicName } = params;
  rootStore.setCurrentlyViewedGroup(groupId);
  rootStore.setCurrentViewedTopicId(topicId);

  navigation.navigate('Chat', { topicId, topicName });
  
  await messageReceived();
}

export async function onNotificationOpened(navigation: Navigation, notificationOpen: GiNotification) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    navigation,
    groupId, 
    topicId,
    topicName,
  });
}

export async function onInitialNotification(navigation: Navigation, notificationOpen: GiNotification) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    navigation,
    groupId, 
    topicId,
    topicName,
  });
}
