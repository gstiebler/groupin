import { GiftedChat } from 'react-native-gifted-chat';
import React from 'react';
import { 
  Container, 
  Header, 
  Left, 
  Body, 
  Right, 
  Thumbnail,
  Title, 
  Subtitle, 
  Button, 
  Icon, 
  Item, 
  Input, 
  List, 
  ListItem,
  Text,
} from 'native-base';
import { SafeAreaView } from 'react-navigation';


const ChatComponent = ({ navigation, messages, title, onSend, onBack, willFocus }) => {  
  navigation.addListener('willFocus', willFocus);

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
        user={{
          _id: 1,
        }}
      />
    </Container>
  );
}

export default ChatComponent;
