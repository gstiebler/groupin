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
    onCreate: (navigator, { params }, name) => dispatch(createTopic(navigator, params.groupId, name)),
  };
};

const NewTopicContainer = connect(mapStateToProps, mapDispatchToProps)(NewTopicComponent);
export default NewTopicContainer;

