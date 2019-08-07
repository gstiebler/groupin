import { GiftedChat } from 'react-native-gifted-chat';
import React from 'react';
import { 
  Container,
} from 'native-base';
import { SafeAreaView } from 'react-navigation';


const ChatComponent = ({ 
  navigation, 
  messages, 
  userId, 
  hasOlderMessages,
  onSend, 
  onLoadEarlier, 
  willFocus, 
  willLeave,
}) => {  
  navigation.addListener('willFocus', willFocus);
  navigation.addListener('willBlur', willLeave);

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
