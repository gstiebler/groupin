import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { GiMessage } from '../lib/messages';

export type ChatProps = {
  messages: GiMessage[],
  userId: string, 
  hasOlderMessages: boolean,
  title: string;
  onSend: (messages: GiMessage[]) => void, 
  onLoadEarlier: () => void,
};

const ChatComponent: React.FC<ChatProps> = ({ 
  messages, 
  userId, 
  hasOlderMessages,
  title,
  onSend, 
  onLoadEarlier,
}) => (
  <GiftedChat
    messages={messages}
    user={{ _id: userId }}
    loadEarlier={hasOlderMessages}
    renderUsernameOnMessage={true}
    onSend={newMessages => onSend(newMessages)}
    onLoadEarlier={() => onLoadEarlier()}
  />
);

export default ChatComponent;
