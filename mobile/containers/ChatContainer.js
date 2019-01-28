import { connect } from "react-redux";
import { sendMessages } from '../actions/rootActions';
import ChatComponent from '../components/Chat';
import { 
  getMessagesOfTopic,
} from "../actions/rootActions";
import { 
  CHAT_TITLE,
} from "../constants/action-types";

const mapStateToProps = state => {
  return { 
    title: state.chat.title,
    messages: state.base.messages 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSend: messages => sendMessages(dispatch, messages),
    onBack: navigation => navigation.goBack(),
    willFocus: ({ state }) => { 
      dispatch({ type: CHAT_TITLE, payload: { title: state.params.topicName } });
      getMessagesOfTopic(dispatch, state.params.topicId) 
    },
    onBack: (navigation) =>{ 
      navigation.goBack()
    },
  };
};

const ChatContainer = connect(mapStateToProps, mapDispatchToProps)(ChatComponent);
export default ChatContainer;
