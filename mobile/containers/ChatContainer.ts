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
    willFocus: ({ params }) => {
      dispatch(onTopicOpened({ 
        topicId: params.topicId, 
        topicName: params.topicName, 
        storage,
        subscribeFn: (topicId) => { fcm.subscribeToTopic(topicId); },
      }));
    },
    willLeave: ({ params }) => {
      dispatch(onTopicClosed({
        topicId: params.topicId,
        unsubscribeFn: (formattedTopicId) => { fcm.unsubscribeToTopic(formattedTopicId); },
      }));
    },
    onLoadEarlier: ({ state }) => dispatch(onOlderMessagesRequested(state.params.topicId)),
  };
};

const ChatContainer = connect(mapStateToProps, mapDispatchToProps)(ChatComponent);
export default ChatContainer;
