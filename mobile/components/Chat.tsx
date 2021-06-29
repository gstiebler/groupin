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
  navigation: ChatScreenNavigationProp;
  messages: GiMessage[],
  userId: string, 
  hasOlderMessages: boolean,
  title: string;
  onSend: (messages: GiMessage[]) => void, 
  onLoadEarlier: () => void, 
  willFocus: () => void;
  willLeave: () => void;
};

const ChatComponent = ({ 
  navigation,
  messages, 
  userId, 
  hasOlderMessages,
  title,
  onSend, 
  onLoadEarlier, 
  willFocus, 
  willLeave,
}: ChatProps) => {  
  useEffect(() => navigation.addListener('focus', () => willFocus()), [navigation]);
  useEffect(() => navigation.addListener('blur', () => willLeave()), [navigation]);

  return (
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
}

export default ChatComponent;
