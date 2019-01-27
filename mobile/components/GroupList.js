import React from 'react';
import { List, ListItem } from 'react-native-elements'
import { Container, Header, Left, Body, Right, Title, Subtitle, Button, Icon } from 'native-base';
import { SafeAreaView } from 'react-native';

export default GroupListComponent = ({ navigation, ownGroups, selectGroup, willFocus, onAdd }) => {
  navigation.addListener('willFocus', willFocus);

  const header = (
    <Header>   
      <Left />
      <Body>
        <Title>Meus grupos</Title>
      </Body>
      <Right>
        <Button transparent>
          <Icon name='add' onPress={() => onAdd(navigation)}/>
        </Button>
      </Right>
    </Header>
  );

  const groupItems = ownGroups.map((group) => (
    <ListItem
      roundAvatar
      avatar={{ uri: group.imgUrl }}
      key={group.id}
      title={group.name}
      onPress={() => selectGroup(navigation, group.id) }
    />
  ));

  return (
    <Container>
      { header }
      <List containerStyle={{marginBottom: 20}}>
        { groupItems }
      </List>
    </Container>
  );
}
