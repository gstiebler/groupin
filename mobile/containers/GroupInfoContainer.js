import GroupInfoComponent from '../components/GroupInfo';
import { 
  getGroupInfo,
  leaveGroup,
  joinGroup,
} from '../actions/groupActions';
import { CURRENT_GROUP_INFO } from "../constants/action-types";

const mapStateToProps = state => {
  return { 
    groupInfo: state.base.currentGroupInfo,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    willFocus: ({ params }) => dispatch(getGroupInfo(params.groupId)),
    onLeaveGroup: (navigation, groupId) => {
      const onLeave = () => navigation.navigate('GroupList');
      dispatch(leaveGroup(groupId, onLeave));
    },
    onJoinGroup: (navigation, groupId) => {
      const onJoin = groupName => navigation.navigate('TopicsList', { groupId, groupName });
      dispatch(joinGroup(groupId, onJoin));
    },
    willLeave: () => { 
      dispatch({ type: CURRENT_GROUP_INFO, payload: { currentGroupInfo: {} } });
    },
  };
};


const GroupInfoContainer = connect(mapStateToProps, mapDispatchToProps)(GroupInfoComponent);
export default GroupInfoContainer;
