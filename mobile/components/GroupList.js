import React from 'react';
import { List, ListItem } from 'react-native-elements'
import { Container, Header, Left, Body, Right, Title, Button, Icon } from 'native-base';

export default GroupListComponent = ({ navigation, ownGroups, selectGroup, willFocus }) => {
  navigation.addListener('willFocus', willFocus);

  const groupItems = ownGroups.map((group) => (
    <ListItem
      // roundAvatar
      // avatar={{ uri: group.imgUrl }}
      key={group.id}
      title={group.name}
      onPress={() => selectGroup(navigation, group.id, group.name) }
    />
  ));

  return (
    <Container>
      <List containerStyle={{marginBottom: 20}}>
        { groupItems }
      </List>
    </Container>
  );
}
