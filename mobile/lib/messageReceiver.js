import AsyncStorage from '@react-native-community/async-storage';
const { 
  getTopicsOfCurrentGroup,
  getMessagesOfCurrentTopic,
} = require('../actions/rootActions');

const { 
  CURRENTLY_VIEWED_GROUP_ID,
  CURRENTLY_VIEWED_TOPIC_ID,
} = require("../constants/action-types");


async function messageReceived(store, message) {
  await Promise.all([
    getTopicsOfCurrentGroup(store),
    getMessagesOfCurrentTopic(store, AsyncStorage),
  ]);
}

async function onNewNotification(store, groupId, topicId) {
  console.log(notificationOpen);
  store.dispatch({ type: CURRENTLY_VIEWED_GROUP_ID, payload: { 
    currentlyViewedGroupId: groupId 
  } });

  store.dispatch({ type: CURRENTLY_VIEWED_TOPIC_ID, payload: { 
    currentlyViewedTopicId: topicId
  } });
  
  await Promise.all([
    getTopicsOfCurrentGroup(store),
    getMessagesOfCurrentTopic(store, AsyncStorage),
  ]);
}

async function onNotificationOpened(store, notificationOpen) {
  onNewNotification(store, notificationOpen.payload.groupId, notificationOpen.payload.topicId);
}

async function onInitialNotification(store, notificationOpen) {
  onNewNotification(store, notificationOpen.payload.groupId, notificationOpen.payload.topicId);
}

module.exports = {
  messageReceived,
  onNotificationOpened,
  onInitialNotification,
};
