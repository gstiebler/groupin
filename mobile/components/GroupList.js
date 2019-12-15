import React from 'react';
import { ListView, View } from 'react-native';
import { Container, List, ListItem, Button, Text, Icon, Left } from 'native-base';

const GroupListComponent = ({ 
  navigation, 
  ownGroups, 
  selectGroup, 
  onLeaveGroup, 
  onPinClicked,
  willFocus,
}) => {
  navigation.addListener('willFocus', willFocus);

  let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

  const pinLeftIcon = (
    <Left>
      <Icon name="md-arrow-up" />
    </Left>
  );
  
  const renderGroup = group => {
    const fontWeight = group.unread ? 'bold' : 'normal';
    return (
      <ListItem onPress={() => selectGroup(navigation, group.id, group.name) }>
        { group.pinned ? pinLeftIcon : <View /> }
        <Text style={{ fontWeight }}> {"  " + group.name} </Text>
      </ListItem>
    );
  };

  const renderDeleteButton = (group /*, secId, rowId, rowMap */) => {
    return (
      <Button full danger onPress={() => onLeaveGroup(group.id)}>
        <Icon active name="trash" />
      </Button>
    );
  }

  const renderPinButton = (group /* , secId, rowId, rowMap */) => {
    const pinIconName = group.pinned ? 'md-arrow-down' : 'md-arrow-up';
    return (
      <Button full onPress={() => onPinClicked(group) }>
        <Icon active name={pinIconName} />
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
        renderRightHiddenRow={renderPinButton}    
      />
    </Container>
  );
}

export default GroupListComponent;
