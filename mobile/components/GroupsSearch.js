import React from 'react';
import { 
  Container, 
  Header, 
  Left, 
  Body, 
  Right, 
  Thumbnail,
  Button, 
  Icon, 
  Item, 
  Input, 
  List, 
  ListItem,
  Text,
  Content,
} from 'native-base';
import Search from 'react-native-search-box';

const GroupSearchComponent = ({ 
    navigation,
    groups,
    changeSearchText, 
    onGroupAdded,
    onBack,
  }) => {
  const rightButtonAdd = (
    <Right>
      <Button iconLeft light onPress={() =>onGroupAdded(navigation, group.id)}>
        <Icon name='add' />
      </Button>
    </Right>
  );

  const groupItems = groups.map((group) => (
    <ListItem key={group.id} >
      <Body>
        <Text>{group.name}</Text>
      </Body>
    </ListItem>
  ));

  const reset = () => changeSearchText('');

  return (
    <Container>
      <Content>
        <Search
          cancelButtonWidth={80}
          onSearch={changeSearchText}
          onChangeText={changeSearchText}
          onCancel={reset}
          onDelete={reset}
          cancelTitle='Cancelar'
          placeholder='Buscar'
        />
        <List containerStyle={{marginBottom: 20}}>
          { groupItems }
        </List>
      </Content>
    </Container>
  );
}

export default GroupSearchComponent;
