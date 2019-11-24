import React from 'react';
import { ListView } from 'react-native';
import { Container, List, ListItem, Button, Text, Icon } from 'native-base';

export default GroupListComponent = ({ 
  navigation, 
  ownGroups, 
  selectGroup, 
  onLeaveGroup, 
  willFocus,
}) => {
  navigation.addListener('willFocus', willFocus);

  let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

  const renderGroup = group => {
    const fontWeight = group.unread ? 'bold' : 'normal';
    return (
      <ListItem onPress={() => selectGroup(navigation, group.id, group.name) }>
        <Text style={{ fontWeight }}> {"  " + group.name} </Text>
      </ListItem>
    );
  };

  const renderDeleteButton = (group, secId, rowId, rowMap) => {
    return (
      <Button full danger onPress={() => onLeaveGroup(group.id)}>
        <Icon active name="trash" />
      </Button>
    );
  }

  const renderPinButton = (group, secId, rowId, rowMap) => {
    return (
      <Button full danger onPress={() => onLeaveGroup(group.id)}>
        <Icon active name="trash" />
      </Button>
    );
  }

  return (
    <Container>
      <List 
        containerStyle={{marginBottom: 20}}
        dataSource={ds.cloneWithRows(ownGroups)}
        leftOpenValue={75}
        rightOpenValue={-75} 
        renderRow={renderGroup}
        renderLeftHiddenRow={renderDeleteButton}   
        renderRightHiddenRow={renderDeleteButton}    
        />
    </Container>
  );
}
