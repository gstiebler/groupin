import React from 'react';
import { TouchableHighlight, View, StyleSheet } from 'react-native';
import { Container, Button, Text, Icon, ListItem, Body, Left } from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';

const GroupListComponent = ({ 
  navigation, 
  ownGroups, 
  selectGroup, 
  onLeaveGroup, 
  onPinClicked,
  willFocus,
}) => {
  React.useEffect(() => navigation.addListener('focus', willFocus), [navigation]);
  
  const renderGroup = ({ item: group }) => {
    const fontWeight = group.unread ? 'bold' : 'normal';
    return (
      <TouchableHighlight
        onPress={() => console.log('You touched me')}
        style={styles.rowFront}
        underlayColor={'#AAA'}
      >
        <View style={styles.frontView}>   
          { group.pinned ? <Icon name="md-arrow-up" /> : <View style={{ paddingLeft: 10 }}/> }
          <Text 
            style={{ fontWeight }}
            onPress={() => selectGroup(navigation, group.id, group.name) }
          >{ group.name } </Text>
        </View>
      </TouchableHighlight>
    );
  };

  const renderHiddenItem = (data) => {
    const group = data.item;
    const pinIconName = group.pinned ? 'md-arrow-down' : 'md-arrow-up';
    return (
      <View style={styles.rowBack}>
        <Button 
          style={styles.backLeftBtn}
          full danger onPress={() => onLeaveGroup(group.id)}>
          <Icon active name="trash" />
        </Button>
        <Button 
          style={styles.backRightBtn}
          full onPress={() => onPinClicked(group) }>
          <Icon active name={pinIconName} />
        </Button>
      </View>
    );
  };

  return (
    <Container>
      <SwipeListView
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
