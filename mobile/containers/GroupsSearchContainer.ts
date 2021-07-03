import { useEffect } from 'react';
import GroupsSearchComponent from '../components/GroupsSearch';
import { Navigation } from '../components/Navigator.types';
import { GroupSearchStore } from '../stores/storesFactory';

const GroupsSearchContainer: React.FC<{ navigation: Navigation }> = ({ navigation }) => {
  const willLeave = () => GroupSearchStore.reset();
  useEffect(() => navigation.addListener('blur', willLeave), [navigation]);

  return GroupsSearchComponent({
    groups: GroupSearchStore.groups,
    changeSearchText: (searchText) => GroupSearchStore.findGroups(searchText),
    onGroupSelected: (groupId) => navigation.push('GroupInfo', { groupId }),
  });
}
export default GroupsSearchContainer;
