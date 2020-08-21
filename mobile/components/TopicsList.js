import React from 'react';
import { TouchableHighlight, View, StyleSheet } from 'react-native';
import { Container, Button, Text, Icon, ListItem, Body, Left } from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';

export default ({ navigation, route, topics, selectTopic, onPinClicked, willFocus, willLeave }) => {
  React.useEffect(() => navigation.addListener('focus', () => willFocus(route)), [navigation]);
  React.useEffect(() => navigation.addListener('blur', willLeave), [navigation]);

  const renderTopic = ({ item: topic }) => {
    const fontWeight = topic.unread ? 'bold' : 'normal';
    return (
      <ListItem icon style={{ backgroundColor: "white", opacity: 1 }}>
        <Left>
          { topic.pinned ? <Icon name="md-arrow-up" /> : <View /> }
        </Left>
        <Body>
          <Text 
            style={{ fontWeight }}
            onPress={() => selectTopic(navigation, topic.id, topic.name) }
          >{ topic.name } </Text>
        </Body>
      </ListItem>
    );
  };

  const renderHiddenItem = (data) => {
    const group = data.item;
    const pinIconName = group.pinned ? 'md-arrow-down' : 'md-arrow-up';
    return (
      <View style={styles.rowBack}>
        <View />
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
        data={topics}
        rightOpenValue={-75} 
        renderItem={renderTopic}
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
