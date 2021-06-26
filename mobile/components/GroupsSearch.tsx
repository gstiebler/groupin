import React from 'react';
import { 
  Container, 
  Body,  
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
  willLeave,
  // onBack,
}) => {
  navigation.addListener('blur', willLeave);

  const renderGroup = (group) => (
    <ListItem button onPress={ () => onGroupSelected(navigation, group.id) }>
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
        <List 
          dataArray={groups} 
          renderRow={renderGroup}
        />
      </Content>
    </Container>
  );
}

export default GroupSearchComponent;
