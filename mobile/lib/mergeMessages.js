import { GiftedChat } from 'react-native-gifted-chat';

export default function mergeMessages(allMessages, newMessages) {
  const newMessage = newMessages[0];
  return GiftedChat.append(allMessages, newMessage);
}
