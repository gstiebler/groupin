import { connect } from "react-redux";
import NewTopicComponent from '../components/NewTopic';
import { 
  // NEW_TOPIC_NAME,
} from "../constants/action-types";
import { createTopic } from '../actions/newTopicActions';

const mapStateToProps = () => {
  return { 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCreate: (navigator, name) => dispatch(createTopic(navigator, navigator.state.params.groupId, name)),
  };
};

const NewTopicContainer = connect(mapStateToProps, mapDispatchToProps)(NewTopicComponent);
export default NewTopicContainer;

