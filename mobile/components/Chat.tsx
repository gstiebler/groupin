import { GiftedChat } from 'react-native-gifted-chat';
import { useEffect } from 'react';
import { 
  Container,
} from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './Navigator';
import { RouteProp } from '@react-navigation/native';
import { GiMessage } from '../lib/messages';

export type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;
export type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;
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
