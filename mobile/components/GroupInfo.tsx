import React from 'react';
import { StyleSheet } from 'react-native';
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
    <VStack style={styles.stack} space={4} >
      <Text>{ groupInfo?.name }</Text>
      <Text>{ groupInfo?.description }</Text>
      <Text>{ groupInfo?.visibilityLabel }</Text>
      <Text>{ `Identificador: "${ groupInfo?.friendlyId }"` }</Text>
      { button }
    </VStack>
  );
}

const styles = StyleSheet.create({
  stack: {
    margin: 20,
  },
});

export default GroupInfoComponent;
