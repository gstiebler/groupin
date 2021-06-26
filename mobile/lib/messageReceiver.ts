import storage from './localStorage';
import { getTopicsOfCurrentGroup, getMessagesOfCurrentTopic } from '../actions/rootActions';

import { CURRENTLY_VIEWED_GROUP_ID, CURRENTLY_VIEWED_TOPIC_ID } from "../constants/action-types";


export async function messageReceived(store, message) {
  await Promise.all([
    getTopicsOfCurrentGroup(store),
    getMessagesOfCurrentTopic(store, storage),
  ]);
}

export async function onNewNotification({navigateFn, store, groupId, topicId, topicName}) {
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
