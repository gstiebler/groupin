import { localStorage as storage } from '../lib/localStorage';
import { rootStore } from '../stores/storesFactory';
import ChatComponent, { ChatScreenNavigationProp, ChatScreenRouteProp } from '../components/Chat';
import React, { useEffect } from 'react';
const fcm = require('../lib/fcm');

type ContainerProp = { navigation: ChatScreenNavigationProp, route: ChatScreenRouteProp };
const ChatContainer: React.FC<ContainerProp> = ({ navigation, route }) => {
  const willFocus = () => {
    rootStore.topicStore.onTopicOpened({ 
      topicId: route.params.topicId, 
      topicName: route.params.topicName, 
      storage,
      subscribeFn: (topicId) => { fcm.subscribeToTopic(topicId); },
    });
  };
      
  const willLeave = () => {
    rootStore.topicStore.onTopicClosed({
      topicId: route.params.topicId,
      unsubscribeFn: (formattedTopicId) => { fcm.unsubscribeToTopic(formattedTopicId); },
    });
  };
  useEffect(() => navigation.addListener('focus', willFocus), [navigation]);
  useEffect(() => navigation.addListener('blur', () => willLeave()), [navigation]);
  return ChatComponent({
    title: rootStore.topicStore.topicTitle,
    messages: rootStore.messages,
    userId: rootStore.userId, 
    hasOlderMessages: rootStore.hasOlderMessages,
    onSend: messages => rootStore.sendMessages(messages),
    onLoadEarlier: () => rootStore.onOlderMessagesRequested(route.params.topicId),
  })
};
export default ChatContainer;
