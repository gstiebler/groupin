import { connect } from "react-redux";
import storage from '../lib/localStorage';
import { sendMessages } from '../actions/rootActions';
import ChatComponent from '../components/Chat';
import { 
  onTopicOpened,
  onOlderMessagesRequested,
  setTopicLatestRead,
} from "../actions/rootActions";
import { 
  CHAT_TITLE,
  CHAT_TOPIC_ID,
  CURRENTLY_VIEWED_TOPIC_ID,
  SET_MESSAGES,
} from "../constants/action-types";

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
      dispatch({ type: CHAT_TITLE, payload: { title: state.params.topicName } });
      dispatch({ type: CHAT_TOPIC_ID, payload: { topicId: state.params.topicId } });
      // is `currentlyViewedTopicId` redundant with `topicId`?
      dispatch({ type: CURRENTLY_VIEWED_TOPIC_ID, payload: { currentlyViewedTopicId: state.params.topicId } });
      dispatch(onTopicOpened(state.params.topicId, storage));
    },
    willLeave: ({ lastState }) => {
      dispatch({ type: CURRENTLY_VIEWED_TOPIC_ID, payload: { currentlyViewedTopicId: null } });
      dispatch({ type: SET_MESSAGES, payload: { messages: [] } });
      console.log('params: **** ', lastState, '  ***----*******');
      setTopicLatestRead(lastState.params.topicId);
    },
    onLoadEarlier: ({ state }) => dispatch(onOlderMessagesRequested(state.params.topicId)),
  };
};

const ChatContainer = connect(mapStateToProps, mapDispatchToProps)(ChatComponent);
export default ChatContainer;
