import React from 'react';
import { Button, Text, VStack } from 'native-base';
import { FeGroupInfo } from '../stores/groupStore';

export type GroupInfoProps = {
  groupInfo?: FeGroupInfo;
  onJoinGroup: () => void;
  onLeaveGroup: () => void;
};

const GroupInfoComponent: React.FC<GroupInfoProps> = ({ groupInfo, onJoinGroup, onLeaveGroup }) => {
  const joinButton = (
    <Button onPress={() => onJoinGroup()} >
      <Text>Entrar no grupo</Text>
    </Button>
  );

  const leaveButton =  (
    <Button onPress={() => onLeaveGroup()} >
      <Text>Sair do grupo</Text>
    </Button>
  );

  const button = 
    !groupInfo        ? null :
    groupInfo.iBelong ? leaveButton : joinButton;

  return (
    <VStack space={4} alignItems="center">
      <Text>{ groupInfo?.name }</Text>
      <Text>{ groupInfo?.description }</Text>
      <Text>{ groupInfo?.visibilityLabel }</Text>
      <Text>{ `Identificador: "${ groupInfo?.friendlyId }"` }</Text>
      { button }
    </VStack>
  );
}

export default GroupInfoComponent;
