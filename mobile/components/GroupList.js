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
      <ListItem icon style={{ backgroundColor: "white" }}>
        <Left>
          { group.pinned ? <Icon name="md-arrow-up" /> : <View /> }
        </Left>
        <Body>
          <Text 
            style={{ fontWeight }}
            onPress={() => selectGroup(navigation, group.id, group.name) }
          >{ group.name } </Text>
        </Body>
      </ListItem>
    );
  };

  const renderHiddenItem = (data) => {
    const group = data.item;
    const pinIconName = group.pinned ? 'md-arrow-down' : 'md-arrow-up';
    return (
      <View style={styles.rowBack}>
        <Button 
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
        rightOpenValue={-75} 
        renderItem={renderGroup}
        renderHiddenItem={renderHiddenItem}   
      />
    </Container>
  );
}


const styles = StyleSheet.create({
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
});

export default GroupListComponent;
