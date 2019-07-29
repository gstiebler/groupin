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


const ChatComponent = ({ navigation, messages, title, userId, onSend, onBack, willFocus, willLeave }) => {  
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
        onSend={newMessages => onSend(newMessages)}
        user={{ _id: userId }}
        inverted={false}
      />
    </Container>
  );
}

export default ChatComponent;
