import storage from './localStorage';
const { 
  getTopicsOfCurrentGroup,
  getMessagesOfCurrentTopic,
} = require('../actions/rootActions');

const { 
  CURRENTLY_VIEWED_GROUP_ID,
  CURRENTLY_VIEWED_TOPIC_ID,
} = require("../constants/action-types");


async function messageReceived(store/*, message*/) {
  await Promise.all([
    getTopicsOfCurrentGroup(store),
    getMessagesOfCurrentTopic(store, storage),
  ]);
}

async function onNewNotification({navigateFn, store, groupId, topicId, topicName}) {
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

async function onNotificationOpened(navigateFn, store, notificationOpen) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    navigateFn, 
    store, 
    groupId, 
    topicId,
    topicName,
  });
}

async function onInitialNotification(navigateFn, store, notificationOpen) {
  const { groupId, topicId, topicName } = notificationOpen.notification.data;
  onNewNotification({
    navigateFn, 
    store, 
    groupId, 
    topicId,
    topicName,
  });
}

module.exports = {
  messageReceived,
  onNotificationOpened,
  onInitialNotification,
};
