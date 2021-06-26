import TopicsListComponent from '../components/TopicsList';
import { 
  getTopicsOfGroup,
  setTopicPin,
 } from '../actions/rootActions';
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
    willFocus: (route) => { 
      dispatch({ type: CURRENTLY_VIEWED_GROUP_ID, payload: { currentlyViewedGroupId: route.params.groupId } });
      getTopicsOfGroup(dispatch, route.params.groupId);
    },
    willLeave: () => { 
      dispatch({ type: CURRENTLY_VIEWED_GROUP_ID, payload: { currentlyViewedGroupId: null } });
      dispatch({ type: SET_TOPICS, payload: { topics: [] } });
    },
    onPinClicked: (topic) => dispatch(setTopicPin({ topicId: topic.id, pinned: !topic.pinned })),
  };
};


const TopicsList = connect(mapStateToProps, mapDispatchToProps)(TopicsListComponent);
export default TopicsList;
