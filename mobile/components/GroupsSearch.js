import React from 'react';
import { 
  Container, 
  Header, 
  Left, 
  Body, 
  Right, 
  Thumbnail,
  Title, 
  Subtitle, 
  Button, 
  Icon, 
  Item, 
  Input, 
  List, 
  ListItem,
  Text,
} from 'native-base';

const GroupSearchComponent = ({ 
    navigation,
    searchText, 
    groups,
    changeSearchText, 
    onGroupAdded,
    onBack,
  }) => {
  const header = (
    <Header searchBar rounded>   
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Buscar" value={searchText} onChangeText={changeSearchText}/>
          </Item>
    </Header>
  );

  const groupItems = groups.map((group) => (
    <ListItem
      avatar
      key={group.id} 
    >
      <Left>
        <Thumbnail source={{ uri: group.imgUrl }} />
      </Left>
      <Body>
        <Text>{group.name}</Text>
      </Body>
      <Right>
        <Button iconLeft light onPress={() =>onGroupAdded(navigation, group.id)}>
          <Icon name='add' />
          <Text>Add</Text>
        </Button>
      </Right>
    </ListItem>
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

export default GroupSearchComponent;
