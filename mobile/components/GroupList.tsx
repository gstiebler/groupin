import React from 'react';
import { StyleSheet, ListRenderItemInfo, Pressable } from 'react-native';
import { Container, Button, Text, Box } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import * as _ from 'lodash';
import { Group } from '../lib/server';

export type GroupListProps = {
  ownGroups: Group[];
  selectGroup: (groupId: string, groupName: string) => void;
  onLeaveGroup: (groupId: string) => void;
  onPinClicked: (group: Group) => void;
};

const GroupListComponent: React.FC<GroupListProps> = ({
  ownGroups, 
  selectGroup, 
  onLeaveGroup, 
  onPinClicked,
}) => {
  const renderGroup = ({ item: group }: ListRenderItemInfo<Group>) => {
    const fontWeight = group.unread ? 'bold' : 'normal';
    return (
      <Pressable
        onPress={() => selectGroup(group.id, group.name) }
        style={styles.rowFront}
      >
        <Box style={styles.frontView}>   
          {group.pinned ? <Ionicons size={25} name="md-arrow-up" /> : <Box style={{ paddingLeft: 10 }}/> }
          <Text 
            style={{ fontWeight }}
            onPress={() => selectGroup(group.id, group.name) }
          >{ group.name } </Text>
        </Box>
      </Pressable>
    );
  };

  const renderHiddenItem = ({ item: group }: ListRenderItemInfo<Group>) => {
    const pinIconName = group.pinned ? 'md-arrow-down' : 'md-arrow-up';
    return (
      <Box style={styles.rowBack}>
        <Button 
          variant="ghost"
          style={styles.backLeftBtn}
          onPress={() => onLeaveGroup(group.id)}>
          <Ionicons name="trash" size={20} />
        </Button>
        <Button 
          variant="ghost"
          style={styles.backRightBtn}
          onPress={() => onPinClicked(group) }>
          <Ionicons name={pinIconName} size={20} />
        </Button>
      </Box>
    );
  };

  const getEmpty = () => <Text style={{ padding: 10 }}>Nenhum grupo ainda</Text>

  return _.isEmpty(ownGroups) ? getEmpty() : (
    <SwipeListView<Group>
      style={{ width: '100%' }}
      data={ownGroups}
      leftOpenValue={50}
      rightOpenValue={-50} 
      renderItem={renderGroup}
      renderHiddenItem={renderHiddenItem}   
    />
  );
}

const styles = StyleSheet.create({
  frontView: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rowFront: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  rowBack: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backLeftBtn: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  backRightBtn: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
});

export default GroupListComponent;
