import React, { useEffect } from 'react';
import { localStorage as storage } from '../rn_lib/localStorage';
import { rootStore as rootStoreInstance, topicStore as topicStoreInstance } from '../rn_lib/storesFactory';
import ChatComponent, { ChatProps } from '../components/Chat';
import { Navigation, RootStackParamList } from '../rn_lib/Navigator.types';
import { RouteProp } from '@react-navigation/native';
import { notifications } from '../rn_lib/notifications';
import { observer } from 'mobx-react-lite';
import { RootStore } from '../stores/rootStore';
import { TopicStore } from '../stores/topicStore';

export type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;
type ContainerProp = { navigation: Navigation, route: ChatScreenRouteProp, rootStore: RootStore, topicStore: TopicStore };
const ChatContainerObserver: React.FC<ContainerProp> = observer(({ navigation, route, rootStore, topicStore }) => {
  const willFocus = () => {
    topicStore.onTopicOpened({ 
      topicId: route.params.topicId, 
      topicName: route.params.topicName, 
      storage,
      subscribeFn: (topicId) => { notifications.subscribeToTopic(topicId); },
    });
  };
      
  const willLeave = () => {
    topicStore.onTopicClosed({
      topicId: route.params.topicId,
      unsubscribeFn: (formattedTopicId) => { notifications.unsubscribeFromTopic(formattedTopicId); },
    });
  };
  useEffect(() => navigation.addListener('focus', willFocus), [navigation]);
  useEffect(() => navigation.addListener('blur', () => willLeave()), [navigation]);
  
  const props: ChatProps = {
    title: topicStore.topicTitle,
    messages: topicStore.messagesView,
    userId: rootStore.userId, 
    hasOlderMessages: topicStore.hasOlderMessages,
    onSend: messages => topicStore.sendMessages(messages),
    onLoadEarlier: () => topicStore.onOlderMessagesRequested(route.params.topicId),
  }
  return <ChatComponent {...props} />;
}); 
const ChatContainer: React.FC<{ navigation: Navigation, route: ChatScreenRouteProp }> = ({ navigation, route }) => (
  <ChatContainerObserver navigation={navigation} route={route} rootStore={rootStoreInstance} topicStore={topicStoreInstance} />
);
export default ChatContainer;
