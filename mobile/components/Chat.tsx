import { GiftedChat } from 'react-native-gifted-chat';
import { useEffect } from 'react';
import { 
  Container,
} from 'native-base';

const ChatComponent = ({ 
  navigation,
  route,
  messages, 
  userId, 
  hasOlderMessages,
  onSend, 
  onLoadEarlier, 
  willFocus, 
  willLeave,
}) => {  
  useEffect(() => navigation.addListener('focus', () => willFocus(route)), [navigation]);
  useEffect(() => navigation.addListener('blur', () => willLeave(route)), [navigation]);

  return (
    <Container>
      <GiftedChat
        messages={messages}
        user={{ _id: userId }}
        loadEarlier={hasOlderMessages}
        renderUsernameOnMessage={true}
        onSend={newMessages => onSend(newMessages)}
        onLoadEarlier={() => onLoadEarlier(navigation)}
      />
    </Container>
  );
}

export default ChatComponent;
