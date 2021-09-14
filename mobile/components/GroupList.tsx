import React from 'react';
import { TouchableHighlight, View, StyleSheet, ListRenderItemInfo } from 'react-native';
import { Container, Button, Text, Icon } from 'native-base';
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
      <TouchableHighlight
        onPress={() => selectGroup(group.id, group.name) }
        style={styles.rowFront}
        underlayColor={'#AAA'}
      >
        <View style={styles.frontView}>   
          { group.pinned ? <Icon name="md-arrow-up" /> : <View style={{ paddingLeft: 10 }}/> }
          <Text 
            style={{ fontWeight }}
            onPress={() => selectGroup(group.id, group.name) }
          >{ group.name } </Text>
        </View>
      </TouchableHighlight>
    );
  };

  const renderHiddenItem = ({ item: group }: ListRenderItemInfo<Group>) => {
    const pinIconName = group.pinned ? 'md-arrow-down' : 'md-arrow-up';
    return (
      <View style={styles.rowBack}>
        <Button 
          style={styles.backLeftBtn}
          onPress={() => onLeaveGroup(group.id)}>
          <Icon name="trash" />
        </Button>
        <Button 
          style={styles.backRightBtn}
          onPress={() => onPinClicked(group) }>
          <Icon name={pinIconName} />
        </Button>
      </View>
    );
  };

  const getEmpty = () => <Text style={{ padding: 10 }}>Nenhum grupo ainda</Text>

  return _.isEmpty(ownGroups) ? getEmpty() : (
    <Container>
      <SwipeListView<Group>
        data={ownGroups}
        leftOpenValue={50}
        rightOpenValue={-50} 
        renderItem={renderGroup}
        renderHiddenItem={renderHiddenItem}   
      />
    </Container>
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
