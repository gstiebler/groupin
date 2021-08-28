import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { Container } from 'native-base';
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
  <Container>
    <GiftedChat
      messages={messages}
      user={{ _id: userId }}
      loadEarlier={hasOlderMessages}
      renderUsernameOnMessage={true}
      onSend={newMessages => onSend(newMessages)}
      onLoadEarlier={() => onLoadEarlier()}
    />
  </Container>
);

export default ChatComponent;
