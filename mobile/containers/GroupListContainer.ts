import GroupListComponent from '../components/GroupList';
import { useEffect } from 'react';
import { groupStore } from '../rn_lib/storesFactory';
import { Group } from '../lib/server';
import { Navigation } from '../rn_lib/Navigator.types';

const GroupListContainer: React.FC<{ navigation: Navigation }> = ({ navigation }) => {
  const willFocus = () => groupStore.fetchOwnGroups();
  useEffect(() => navigation.addListener('focus', willFocus), [navigation]);

  return GroupListComponent({
    ownGroups: groupStore.ownGroups, 
    selectGroup: (groupId, groupName) => navigation.navigate('TopicsList', { groupId, groupName }), 
    onLeaveGroup: async (groupId) => {
      await groupStore.leaveGroup(groupId);
      navigation.navigate('GroupList');
    }, 
    onPinClicked: (group: Group) => groupStore.setGroupPin({ groupId: group.id, pinned: !group.pinned }),
  });
};
export default GroupListContainer;
