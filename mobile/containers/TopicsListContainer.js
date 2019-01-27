import { connect } from "react-redux";
import TopicsListComponent from '../components/TopicsList';
import { getMessagesOfTopic, getTopicsOfGroup } from '../actions/rootActions';

const mapStateToProps = state => {
  return { 
    topics: state.base.topics,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectTopic: (navigation, topicId) => { 
      getMessagesOfTopic(dispatch, topicId);
      navigation.navigate('Chat', { topicId }); 
    },
    willFocus: (payload) => {
      console.log(payload);
      
      getTopicsOfGroup(dispatch, payload.state.params.groupId)
    },
  };
};


const TopicsList = connect(mapStateToProps, mapDispatchToProps)(TopicsListComponent);
export default TopicsList;
