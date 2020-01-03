import { connect } from "react-redux";
import storage from '../lib/localStorage';
import { sendMessages } from '../actions/rootActions';
import ChatComponent from '../components/Chat';
import {
  onOlderMessagesRequested,
} from "../actions/rootActions";
import { 
  onTopicOpened,
  onTopicClosed,
} from "../actions/topicActions";
const fcm = require('../lib/fcm');

const mapStateToProps = state => {
  return { 
    title: state.chat.title,
    messages: state.base.messages,
    userId: state.base.userId, 
    hasOlderMessages: state.base.hasOlderMessages,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSend: messages => dispatch(sendMessages(messages)),
    willFocus: ({ state }) => {
      dispatch(onTopicOpened({ 
        topicId: state.params.topicId, 
        topicName: state.params.topicName, 
        storage,
        subscribeFn: (topicId) => { fcm.subscribeToTopic(topicId); },
      }));
    },
    willLeave: ({ lastState }) => {
      dispatch(onTopicClosed({
        topicId: lastState.params.topicId,
        unsubscribeFn: (topicId) => { fcm.unsubscribeToTopic(topicId); },
      }));
    },
    onLoadEarlier: ({ state }) => dispatch(onOlderMessagesRequested(state.params.topicId)),
  };
};

const ChatContainer = connect(mapStateToProps, mapDispatchToProps)(ChatComponent);
export default ChatContainer;
