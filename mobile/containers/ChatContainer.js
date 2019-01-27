import { connect } from "react-redux";
import { sendMessages } from '../actions/rootActions';
import ChatComponent from '../components/Chat';

const mapStateToProps = state => {
  return { messages: state.base.messages };
};

const mapDispatchToProps = dispatch => {
  return {
    onSend: messages => sendMessages(dispatch, messages),
    willFocus: ({ state }) => getMessagesOfTopic(dispatch, state.params.topicId),
  };
};

const ChatContainer = connect(mapStateToProps, mapDispatchToProps)(ChatComponent);
export default ChatContainer;
