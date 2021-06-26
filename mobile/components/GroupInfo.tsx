import React from 'react';
import { SafeAreaView } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import styles from '../Style';

const GroupInfoComponent = ({ navigation, route, groupInfo, willFocus, willLeave, onJoinGroup, onLeaveGroup }) => {
  React.useEffect(() => navigation.addListener('focus', () => willFocus(route)), [navigation]);
  React.useEffect(() => navigation.addListener('blur', willLeave), [navigation]);

  const joinButton = (
    <Button block success onPress={() => onJoinGroup(navigation, groupInfo._id)} >
      <Text>Entrar no grupo</Text>
    </Button>
  );

  const leaveButton =  (
    <Button block success onPress={() => onLeaveGroup(navigation, groupInfo._id)} >
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
