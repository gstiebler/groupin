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
    onGroupSelected,
    onBack,
  }) => {

  const renderGroup = (group) => (
    <ListItem button onPress={ () => onGroupSelected(navigation, group._id) }>
      <Body>
        <Text>{group.name}</Text>
      </Body>
    </ListItem>
  );

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
        <List containerStyle={{marginBottom: 20}} 
          dataArray={groups} 
          renderRow={renderGroup}
        />
      </Content>
    </Container>
  );
}

export default GroupSearchComponent;
