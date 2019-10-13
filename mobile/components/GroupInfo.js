import React from 'react';
import { SafeAreaView } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import styles from '../Style';

const GroupInfoComponent = ({ navigation, groupInfo, willFocus, willLeave, onJoinGroup, onLeaveGroup }) => {

  navigation.addListener('willFocus', willFocus);
  navigation.addListener('willBlur', willLeave);

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
      <Container padder contentContainerStyle={styles.container} >
        <Content>
          <Text>{ groupInfo.name }</Text>
          <Text>{ groupInfo.description }</Text>
          { button }
        </Content>
      </Container>
    </SafeAreaView>
  );
}

export default GroupInfoComponent;
