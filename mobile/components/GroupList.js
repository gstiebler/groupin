import React from 'react';
// import { List, ListItem } from 'react-native-elements'
import { ListView } from 'react-native';
import { Container, List, ListItem, Button, Text, Icon } from 'native-base';

export default GroupListComponent = ({ navigation, ownGroups, selectGroup, onLeaveGroup, willFocus }) => {
  navigation.addListener('willFocus', willFocus);

  let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

  return (
    <Container>
      <List 
        containerStyle={{marginBottom: 20}}
        dataSource={ds.cloneWithRows(ownGroups)}
        leftOpenValue={75}
        rightOpenValue={-75} 
        renderRow={group =>
          <ListItem onPress={() => selectGroup(navigation, group.id, group.name) }>
            <Text> {"  " + group.name} </Text>
          </ListItem>
        }
        /*renderLeftHiddenRow={data =>
          <Button full onPress={() => alert(data)}>
            <Icon active name="information-circle" />
          </Button>}*/
        renderRightHiddenRow={(group, secId, rowId, rowMap) =>
          <Button full danger onPress={() => onLeaveGroup(group.id)}>
            <Icon active name="trash" />
          </Button>}    
        />
    </Container>
  );
}
