import { localStorage as storage } from '../lib/localStorage';
import { rootStore } from '../stores/storesFactory';
import ChatComponent, { ChatScreenNavigationProp, ChatScreenRouteProp } from '../components/Chat';
const fcm = require('../lib/fcm');

type ContainerProp = { navigation: ChatScreenNavigationProp, route: ChatScreenRouteProp };
const ChatContainer = ({ navigation, route }: ContainerProp) => ChatComponent({
  navigation,
  title: rootStore.topicStore.topicTitle,
  messages: rootStore.messages,
  userId: rootStore.userId, 
  hasOlderMessages: rootStore.hasOlderMessages,
  onSend: messages => rootStore.sendMessages(messages),
  willFocus: () => {
    rootStore.topicStore.onTopicOpened({ 
      topicId: route.params.topicId, 
      topicName: route.params.topicName, 
      storage,
      subscribeFn: (topicId) => { fcm.subscribeToTopic(topicId); },
    });
  },
  willLeave: () => {
    rootStore.topicStore.onTopicClosed({
      topicId: route.params.topicId,
      unsubscribeFn: (formattedTopicId) => { fcm.unsubscribeToTopic(formattedTopicId); },
    });
  },
  onLoadEarlier: () => rootStore.onOlderMessagesRequested(route.params.topicId),
});
export default ChatContainer;
