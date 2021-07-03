import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect } from 'react';
import GroupsSearchComponent from '../components/GroupsSearch';
import { Navigation } from '../components/Navigator';
import { groupSearchStore } from '../stores/storesFactory';

type ContainerProp = { navigation: Navigation };
const GroupsSearchContainer: React.FC<ContainerProp> = ({ navigation }) => {
  const willLeave = () => groupSearchStore.reset();
  useEffect(() => navigation.addListener('blur', willLeave), [navigation]);

  return GroupsSearchComponent({
    groups: groupSearchStore.groups,
    changeSearchText: (searchText) => groupSearchStore.findGroups(searchText),
    onGroupSelected: (groupId) => navigation.push('GroupInfo', { groupId }),
  });
}
export default GroupsSearchContainer;
