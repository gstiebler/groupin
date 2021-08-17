import { localStorage as storage } from '../rn_lib/localStorage';
import { rootStore as rootStoreInstance } from '../rn_lib/storesFactory';
import ChatComponent from '../components/Chat';
import React, { useEffect } from 'react';
import { Navigation, RootStackParamList } from '../rn_lib/Navigator.types';
import { RouteProp } from '@react-navigation/native';
import { notifications } from '../rn_lib/notifications';
import { observer } from 'mobx-react-lite';
import { RootStore } from '../stores/rootStore';

export type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;
type ContainerProp = { navigation: Navigation, route: ChatScreenRouteProp, rootStore: RootStore };
const ChatContainerObserver: React.FC<ContainerProp> = observer(({ navigation, route, rootStore }) => {
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
}); 
const ChatContainer: React.FC<{ navigation: Navigation, route: ChatScreenRouteProp }> = ({ navigation, route }) => (
  <ChatContainerObserver navigation={navigation} route={route} rootStore={rootStoreInstance} />
);
export default ChatContainer;
