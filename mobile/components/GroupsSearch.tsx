import React from 'react';
import { StyleSheet } from 'react-native';
import {  
  Box,
  Container,
  Divider,
  FlatList,
  Input,
  Text,
  VStack,
} from 'native-base';
import { Group } from '../lib/server';
import { ListRenderItemInfo } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';

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
    <Box w="100%">
      <Divider my={2} />
      <Text onPress={() => onGroupSelected(group.id)}>{group.name}</Text>
    </Box>
  );

  const reset = () => changeSearchText('');

  return (
    <Container>
      <VStack style={styles.stack} w="100%" space={4} alignItems="center">
        <Input
          w="100%"
          onChangeText={changeSearchText}
          placeholder='Buscar'
          InputRightElement={ <Ionicons name='search' size={25} /> }
        />
        <FlatList
          w="100%"
          data={groups}
          renderItem={renderGroup}
        />
      </VStack>
    </Container>
  );
}

const styles = StyleSheet.create({
  stack: {
    margin: 20,
  },
});

export default GroupSearchComponent;
