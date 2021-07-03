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
import { Group } from '../lib/server';

interface GroupSearchProps {
  groups: Group[];
  changeSearchText: (searchText: string) => void;
  onGroupSelected: (groupId: string) => void;
}

const GroupSearchComponent: React.FC<GroupSearchProps> = ({
  groups,
  changeSearchText, 
  onGroupSelected,
}) => {
  const renderGroup = (group: Group) => (
    <ListItem button onPress={ () => onGroupSelected(group.id) }>
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
