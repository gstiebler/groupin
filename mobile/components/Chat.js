import { GiftedChat } from 'react-native-gifted-chat';
import React from 'react';
import { connect } from "react-redux";
import { sendMessages } from '../actions/index';

const mapStateToProps = state => {
  return { messages: state.messages };
};



const mapDispatchToProps = dispatch => {
  return {
    // onSend: messages => dispatch(addMessages(messages))
  };
};

const ChatComponent = ({messages, onSend}) => {
  return (
    <GiftedChat
      messages={messages}
      onSend={newMessages => sendMessages(newMessages)}
      user={{
        _id: 1,
      }}
    />
  );
}

const Chat = connect(mapStateToProps, mapDispatchToProps)(ChatComponent);
export default Chat;
