import React from 'react';
import { TouchableHighlight, View, StyleSheet } from 'react-native';
import { Container, Button, Text, Icon } from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';

const GroupListComponent = ({ 
  navigation, 
  ownGroups, 
  selectGroup, 
  onLeaveGroup, 
  onPinClicked,
  willFocus,
}) => {
  navigation.addListener('focus', willFocus);
  
  const renderGroup = ({ item: group }) => {
    const fontWeight = group.unread ? 'bold' : 'normal';
    return (
      <TouchableHighlight 
        style={styles.rowFront}
        onPress={() => selectGroup(navigation, group.id, group.name) }
      >
        <View>
          { group.pinned ? <Icon name="md-arrow-up" /> : <View /> }
          <Text style={{ fontWeight }}> {"  " + group.name} </Text>
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
          style={styles.leftRightBtn}
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
    <Container style={styles.container}>
      <SwipeListView
        data={ownGroups}
        leftOpenValue={75}
        rightOpenValue={-75} 
        renderItem={renderGroup}
        renderHiddenItem={renderHiddenItem}   
      />
    </Container>
  );
}


const styles = StyleSheet.create({
  container: {
      backgroundColor: 'white',
      flex: 1,
  },
  backTextWhite: {
      color: '#FFF',
  },
  rowFront: {
      alignItems: 'center',
      backgroundColor: 'white',
      borderBottomColor: 'black',
      borderBottomWidth: 1,
      justifyContent: 'center',
      height: 50,
  },
  rowBack: {
      alignItems: 'center',
      backgroundColor: '#DDD',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 15,
  },
  backRightBtn: {
      alignItems: 'center',
      bottom: 0,
      justifyContent: 'center',
      top: 0,
      width: 75,
  },
  backLeftBtn: {
      alignItems: 'center',
      bottom: 0,
      justifyContent: 'center',
      top: 0,
      width: 75,
  },
});

export default GroupListComponent;
