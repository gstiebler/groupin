import { connect } from "react-redux";
import storage from '../lib/localStorage';
import { sendMessages } from '../actions/rootActions';
import ChatComponent from '../components/Chat';
import { 
  onTopicOpened,
  onOlderMessagesRequested,
  onTopicClosed,
} from "../actions/rootActions";

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
      }));
    },
    willLeave: ({ lastState }) => {
      dispatch(onTopicClosed(lastState.params.topicId));
    },
    onLoadEarlier: ({ state }) => dispatch(onOlderMessagesRequested(state.params.topicId)),
  };
};

const ChatContainer = connect(mapStateToProps, mapDispatchToProps)(ChatComponent);
export default ChatContainer;
