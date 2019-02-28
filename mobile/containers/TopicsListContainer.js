import { connect } from "react-redux";
import TopicsListComponent from '../components/TopicsList';
import { getTopicsOfGroup, leaveGroup } from '../actions/rootActions';

const mapStateToProps = state => {
  return { 
    topics: state.base.topics,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectTopic: (navigation, topicId, topicName) => navigation.push('Chat', { topicId, topicName }),
    onAddTopic: (navigation) => navigation.push('NewTopic', { groupId: navigation.state.params.groupId }),
    onLeaveGroup: (navigation) => dispatch(leaveGroup(navigation.state.params.groupId, navigation)),
    willFocus: ({ state }) => getTopicsOfGroup(dispatch, state.params.groupId),
  };
};


const TopicsList = connect(mapStateToProps, mapDispatchToProps)(TopicsListComponent);
export default TopicsList;
