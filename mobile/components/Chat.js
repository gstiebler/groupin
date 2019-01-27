import { GiftedChat } from 'react-native-gifted-chat';
import React from 'react';
import { SafeAreaView } from 'react-navigation';


const ChatComponent = ({messages, onSend}) => {
  return (
    <GiftedChat
      messages={messages}
      onSend={newMessages => onSend(newMessages)}
      user={{
        _id: 1,
      }}
    />
  );
}

export default ChatComponent;
