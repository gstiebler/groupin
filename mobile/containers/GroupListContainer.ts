import GroupListComponent, { GroupListScreenNavigationProp } from '../components/GroupList';
import { useEffect } from 'react';
import { groupStore } from '../stores/storesFactory';
import { Group } from '../lib/server';

type ContainerProp = { navigation: GroupListScreenNavigationProp };
const GroupListContainer: React.FC<ContainerProp> = ({ navigation }) => {

  const willFocus = () => groupStore.fetchOwnGroups();
  useEffect(() => navigation.addListener('focus', willFocus), [navigation]);

  return GroupListComponent({
    ownGroups: groupStore.ownGroups, 
    selectGroup: (groupId, groupName) => navigation.navigate('TopicsList', { groupId, groupName }), 
    onLeaveGroup: (groupId) => groupStore.leaveGroup(groupId, navigation), 
    onPinClicked: (group: Group) => groupStore.setGroupPin({ groupId: group.id, pinned: !group.pinned }),
  });
};
export default GroupListContainer;
