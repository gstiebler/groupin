import { connect } from "react-redux";
import AsyncStorage from 'react-native';
import { sendMessages } from '../actions/rootActions';
import ChatComponent from '../components/Chat';
import { 
  onTopicOpened,
} from "../actions/rootActions";
import { 
  CHAT_TITLE,
  CHAT_TOPIC_ID,
  CURRENTLY_VIEWED_TOPIC_ID,
} from "../constants/action-types";

const mapStateToProps = state => {
  return { 
    title: state.chat.title,
    messages: state.base.messages,
    userId: state.base.userId, 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSend: messages => dispatch(sendMessages(messages)),
    onBack: navigation => navigation.goBack(),
    willFocus: ({ state }) => { 
      dispatch({ type: CHAT_TITLE, payload: { title: state.params.topicName } });
      dispatch({ type: CHAT_TOPIC_ID, payload: { topicId: state.params.topicId } });
      // is `currentlyViewedTopicId` redundant with `topicId`?
      dispatch({ type: CURRENTLY_VIEWED_TOPIC_ID, payload: { currentlyViewedTopicId: state.params.topicId } });
      dispatch(onTopicOpened(state.params.topicId, AsyncStorage));
    },
    willLeave: () => dispatch({ type: CURRENTLY_VIEWED_TOPIC_ID, payload: { currentlyViewedTopicId: null } }),
  };
};

const ChatContainer = connect(mapStateToProps, mapDispatchToProps)(ChatComponent);
export default ChatContainer;
