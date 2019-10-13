import { connect } from "react-redux";
import TopicsListComponent from '../components/TopicsList';
import { getTopicsOfGroup } from '../actions/rootActions';
import { 
  CURRENTLY_VIEWED_GROUP_ID, 
  SET_TOPICS,
} from "../constants/action-types";

const mapStateToProps = state => {
  return { 
    topics: state.base.topics,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectTopic: (navigation, topicId, topicName) => navigation.push('Chat', { topicId, topicName }),
    willFocus: ({ state }) => { 
      dispatch({ type: CURRENTLY_VIEWED_GROUP_ID, payload: { currentlyViewedGroupId: state.params.groupId } });
      getTopicsOfGroup(dispatch, state.params.groupId);
    },
    willLeave: () => { 
      dispatch({ type: CURRENTLY_VIEWED_GROUP_ID, payload: { currentlyViewedGroupId: null } });
      dispatch({ type: SET_TOPICS, payload: { topics: [] } });
    },
  };
};


const TopicsList = connect(mapStateToProps, mapDispatchToProps)(TopicsListComponent);
export default TopicsList;
