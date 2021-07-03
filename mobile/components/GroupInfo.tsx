import React from 'react';
import { SafeAreaView } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import styles from '../Style';
import { FeGroupInfo } from '../stores/groupStore';

export type GroupInfoProps = {
  groupInfo: FeGroupInfo;
  onJoinGroup: () => void;
  onLeaveGroup: () => void;
};

const GroupInfoComponent: React.FC<GroupInfoProps> = ({ groupInfo, onJoinGroup, onLeaveGroup }) => {
  const joinButton = (
    <Button block success onPress={() => onJoinGroup()} >
      <Text>Entrar no grupo</Text>
    </Button>
  );

  const leaveButton =  (
    <Button block success onPress={() => onLeaveGroup()} >
      <Text>Sair do grupo</Text>
    </Button>
  );

  const button = 
    !groupInfo        ? null :
    groupInfo.iBelong ? leaveButton : joinButton;

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <Container>
        <Content>
          <Text>{ groupInfo.name }</Text>
          <Text>{ groupInfo.description }</Text>
          <Text>{ groupInfo.visibilityLabel }</Text>
          <Text>Identificador: "{ groupInfo.friendlyId }"</Text>
          { button }
        </Content>
      </Container>
    </SafeAreaView>
  );
}

export default GroupInfoComponent;
