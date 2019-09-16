import React from 'react';
import { SafeAreaView } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import styles from '../Style';

const GroupInfoComponent = ({ navigation, groupInfo, willFocus, onJoinGroup, onLeaveGroup }) => {

  navigation.addListener('willFocus', willFocus);

  const joinButton = (
    <Button block success onPress={() => onJoinGroup(navigation, groupId)} >
      <Text>Entrar no grupo</Text>
    </Button>
  );

  const leaveButton =  (
    <Button block success onPress={() => onLeaveGroup(navigation, groupId)} >
      <Text>Sair do grupo</Text>
    </Button>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <Container padder contentContainerStyle={styles.container} >
        <Content>
          <Text>{ groupInfo.name }</Text>
          <Text>{ groupInfo.description }</Text>
          { groupInfo && !groupInfo.iBelong ? joinButton : null }
          { groupInfo && groupInfo.iBelong ? leaveButton : null }
        </Content>
      </Container>
    </SafeAreaView>
  );
}

export default GroupInfoComponent;
