import React, { useEffect } from 'react';
import GroupInfoComponent, { GroupInfoScreenNavigationProp, GroupInfoScreenRouteProp } from '../components/GroupInfo';
import { groupStore } from '../stores/storesFactory';

type ContainerProp = { navigation: GroupInfoScreenNavigationProp, route: GroupInfoScreenRouteProp };
const GroupInfoContainer: React.FC<ContainerProp> = ({ navigation, route }: ContainerProp) => {
  const willFocus = () => groupStore.getGroupInfo(route.params.groupId);
  const willLeave = () => groupStore.setCurrentGroupInfo(null);

  useEffect(() => navigation.addListener('focus', willFocus), [navigation]);
  useEffect(() => navigation.addListener('blur', () => willLeave()), [navigation]);

  return GroupInfoComponent({
    groupInfo: groupStore.currentGroupInfo,
    onJoinGroup: () => groupStore.joinGroup(navigation),
    onLeaveGroup: () => groupStore.leaveGroup(navigation),
  });
};
export default GroupInfoContainer;
