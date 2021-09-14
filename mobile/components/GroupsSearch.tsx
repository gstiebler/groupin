import React from 'react';
import {  
  Box,
  FlatList,
  Input,
  Text,
  VStack,
} from 'native-base';
import { Group } from '../lib/server';
import { ListRenderItemInfo } from 'react-native';

export interface GroupSearchProps {
  groups: Group[];
  changeSearchText: (searchText: string) => void;
  onGroupSelected: (groupId: string) => void;
}

const GroupSearchComponent: React.FC<GroupSearchProps> = ({
  groups,
  changeSearchText, 
  onGroupSelected,
}) => {
  const renderGroup = ({ item: group }: ListRenderItemInfo<Group>): React.ReactElement => (
    <Box>
      <Text onPress={() => onGroupSelected(group.id)}>{group.name}</Text>
    </Box>
  );

  const reset = () => changeSearchText('');

  return (
    <VStack space={4} alignItems="center">
        <Input
          onChangeText={changeSearchText}
          placeholder='Buscar'
        />
        <FlatList 
          data={groups} 
          renderItem={renderGroup}
        />
    </VStack>
  );
}

export default GroupSearchComponent;
