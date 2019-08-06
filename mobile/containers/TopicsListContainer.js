import { connect } from "react-redux";
import TopicsListComponent from '../components/TopicsList';
import { getTopicsOfGroup, leaveGroup } from '../actions/rootActions';
import { CURRENTLY_VIEWED_GROUP_ID } from "../constants/action-types";

const mapStateToProps = state => {
  return { 
    topics: state.base.topics,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectTopic: (navigation, topicId, topicName) => navigation.push('Chat', { topicId, topicName }),
    onLeaveGroup: (navigation) => dispatch(leaveGroup(navigation.state.params.groupId, navigation)),
    willFocus: ({ state }) => { 
      dispatch({ type: CURRENTLY_VIEWED_GROUP_ID, payload: { currentlyViewedGroupId: state.params.groupId } });
      getTopicsOfGroup(dispatch, state.params.groupId);
    },
    willLeave: () => dispatch({ type: CURRENTLY_VIEWED_GROUP_ID, payload: { currentlyViewedGroupId: null } }),
  };
};


const TopicsList = connect(mapStateToProps, mapDispatchToProps)(TopicsListComponent);
export default TopicsList;
