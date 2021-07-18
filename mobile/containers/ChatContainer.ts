import { localStorage as storage } from '../rn_lib/localStorage';
import { rootStore } from '../stores/storesFactory';
import ChatComponent from '../components/Chat';
import React, { useEffect } from 'react';
import { Navigation, RootStackParamList } from '../types/Navigator.types';
import { RouteProp } from '@react-navigation/native';
import { notifications } from '../rn_lib/notifications';

export type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;
type ContainerProp = { navigation: Navigation, route: ChatScreenRouteProp };
const ChatContainer: React.FC<ContainerProp> = ({ navigation, route }) => {
  const willFocus = () => {
    rootStore.topicStore.onTopicOpened({ 
      topicId: route.params.topicId, 
      topicName: route.params.topicName, 
      storage,
      subscribeFn: (topicId) => { notifications.subscribeToTopic(topicId); },
    });
  };
      
  const willLeave = () => {
    rootStore.topicStore.onTopicClosed({
      topicId: route.params.topicId,
      unsubscribeFn: (formattedTopicId) => { notifications.unsubscribeFromTopic(formattedTopicId); },
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
