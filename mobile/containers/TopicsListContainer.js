import { connect } from "react-redux";
import TopicsListComponent from '../components/TopicsList';
import { getTopicsOfGroup } from '../actions/rootActions';

const mapStateToProps = state => {
  return { 
    topics: state.base.topics,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectTopic: (navigation, topicId, topicName) => navigation.push('Chat', { topicId, topicName }),
    onAddTopic: (navigation) => navigation.push('NewTopic', { groupId: navigation.state.params.groupId }),
    willFocus: ({ state }) => getTopicsOfGroup(dispatch, state.params.groupId),
  };
};


const TopicsList = connect(mapStateToProps, mapDispatchToProps)(TopicsListComponent);
export default TopicsList;
