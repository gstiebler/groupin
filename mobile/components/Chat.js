import { GiftedChat } from 'react-native-gifted-chat';
import React from 'react';
import { 
  Container, 
  Header,
  Body, 
  Right, 
  Title, 
} from 'native-base';
import { SafeAreaView } from 'react-navigation';


const ChatComponent = ({ 
  navigation, 
  messages, 
  title, 
  userId, 
  hasOlderMessages,
  onSend, 
  onBack, 
  onLoadEarlier, 
  willFocus, 
  willLeave,
}) => {  
  navigation.addListener('willFocus', willFocus);
  navigation.addListener('willBlur', willLeave);

  const header = (
    <Header>
      <Body>
        <Title>{ title }</Title>
      </Body>
      <Right />
    </Header>
  );

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
