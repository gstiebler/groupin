import storage from './localStorage';
import { getTopicsOfCurrentGroup, getMessagesOfCurrentTopic } from '../actions/rootActions';
import { NavFn } from '../components/Navigator';


export async function messageReceived(store, message) {
  await Promise.all([
    getTopicsOfCurrentGroup(store),
    getMessagesOfCurrentTopic(store, storage),
  ]);
}

type NewNotification = {
  navigateFn: NavFn;
  store: any;
  groupId: string;
  topicId: string;
  topicName: string;
}

async function onNewNotification({navigateFn, store, groupId, topicId, topicName}: NewNotification) {
  store.dispatch({ type: CURRENTLY_VIEWED_GROUP_ID, payload: { 
    currentlyViewedGroupId: groupId 
  } });

  store.dispatch({ type: CURRENTLY_VIEWED_TOPIC_ID, payload: { 
    currentlyViewedTopicId: topicId
  } });

  // TODO: push topic list screen
  // navigation.navigate('TopicsList', { groupId, groupName });
  navigateFn('Chat', { topicId, topicName });
  
  await Promise.all([
    getTopicsOfCurrentGroup(store),
    getMessagesOfCurrentTopic(store, storage),
  ]);
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
