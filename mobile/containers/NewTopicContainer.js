import { connect } from "react-redux";
import NewTopicComponent from '../components/NewTopic';
import { 
  NEW_TOPIC_NAME,
} from "../constants/action-types";
import { createTopic } from '../actions/newTopicActions';

const mapStateToProps = state => {
  return { 
    name: state.newTopic.name,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeName: name => dispatch({ type: NEW_TOPIC_NAME, payload: { name } }),
    onCreate: (navigator) => dispatch(createTopic(navigator, navigator.state.params.groupId)),
    willFocus: ({ state }) => dispatch({ type: NEW_TOPIC_NAME, payload: { name: '' } })
  };
};

const NewTopicContainer = connect(mapStateToProps, mapDispatchToProps)(NewTopicComponent);
export default NewTopicContainer;

