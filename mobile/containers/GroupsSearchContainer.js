import { connect } from "react-redux";
import GroupsSearchComponent from '../components/GroupsSearch';
import { findGroups, joinGroup } from '../actions/groupsSearchActions';

const mapStateToProps = state => {
  return { 
    searchText: state.groupsSearch.searchText,
    groups: state.groupsSearch.groups,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeSearchText: searchText => findGroups(dispatch, searchText),
    onGroupAdded: (navigation, groupId) => joinGroup(dispatch, navigation, groupId),
    onBack: (navigation) => navigation.goBack(),
  };
};

const GroupsSearchContainer = connect(mapStateToProps, mapDispatchToProps)(GroupsSearchComponent);
export default GroupsSearchContainer;
