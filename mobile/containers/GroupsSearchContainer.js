import { connect } from "react-redux";
import GroupsSearchComponent from '../components/GroupsSearch';
import { findGroups } from '../actions/groupsSearchActions';

const mapStateToProps = state => {
  return { 
    groups: state.groupsSearch.groups,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeSearchText: searchText => dispatch(findGroups(searchText)),
    onGroupSelected: (navigation, groupId) => {
      navigation.push('GroupInfo', { groupId });
    },
    onBack: (navigation) => navigation.goBack(),
  };
};

const GroupsSearchContainer = connect(mapStateToProps, mapDispatchToProps)(GroupsSearchComponent);
export default GroupsSearchContainer;
