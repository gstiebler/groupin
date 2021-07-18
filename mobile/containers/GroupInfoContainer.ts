import { RouteProp } from '@react-navigation/native';
import React, { useEffect } from 'react';
import GroupInfoComponent from '../components/GroupInfo';
import { Navigation, RootStackParamList } from '../types/Navigator.types';
import { groupStore } from '../stores/storesFactory';

export type GroupInfoScreenRouteProp = RouteProp<RootStackParamList, 'GroupInfo'>;
type ContainerProp = { navigation: Navigation, route: GroupInfoScreenRouteProp };
const GroupInfoContainer: React.FC<ContainerProp> = ({ navigation, route }: ContainerProp) => {
  const willFocus = () => groupStore.getGroupInfo(route.params.groupId);
  const willLeave = () => groupStore.setCurrentGroupInfo(null);

  useEffect(() => navigation.addListener('focus', willFocus), [navigation]);
  useEffect(() => navigation.addListener('blur', () => willLeave()), [navigation]);

  return GroupInfoComponent({
    groupInfo: groupStore.currentGroupInfo,
    onJoinGroup: () => groupStore.joinGroup(navigation),
    onLeaveGroup: () => groupStore.leaveGroup(groupStore.currentGroupInfo._id, navigation),
  });
};
export default GroupInfoContainer;
