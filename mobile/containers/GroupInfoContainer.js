import { connect } from "react-redux";
import LoginComponent from '../components/Login';
import { 
  getGroupInfo,
  leaveGroup,
  joinGroup,
} from '../actions/groupActions';

const mapStateToProps = state => {
  return { 
    groupInfo: state.base.currentGroupInfo,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    willFocus: ({ state }) => dispatch(getGroupInfo(state.params.groupId)),
    onLeaveGroup: (navigation) => {
      const onLeave = () => navigation.navigate('GroupList');
      dispatch(leaveGroup(navigation.state.params.groupId, onLeave));
    },
    onJoinGroup: (navigation) => {
      const groupId = navigation.state.params.groupId;
      const onJoin = groupName => navigation.navigate('TopicsList', { groupId, groupName });
      dispatch(joinGroup(groupId, onJoin));
    },
  };
};


const GroupInfoContainer = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
export default GroupInfoContainer;
