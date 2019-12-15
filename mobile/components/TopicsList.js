import React from 'react';
import { ListView, View } from 'react-native';
import { Container, List, ListItem, Button, Text, Icon, Left } from 'native-base';

export default ({ navigation, topics, selectTopic, onPinClicked, willFocus, willLeave }) => {
  navigation.addListener('willFocus', willFocus);
  navigation.addListener('willBlur', willLeave);

  let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

  const pinLeftIcon = (
    <Left>
      <Icon name="md-arrow-up" />
    </Left>
  );

  const renderTopic = topic => {
    const fontWeight = topic.unread ? 'bold' : 'normal';
    return (
      <ListItem onPress={() => selectTopic(navigation, topic.id, topic.name) }>
        { topic.pinned ? pinLeftIcon : <View /> }
        <Text style={{ fontWeight }}> {"  " + topic.name} </Text>
      </ListItem>
    );
  };

  const renderPinButton = (topic/*, secId, rowId, rowMap*/) => {
    const pinIconName = topic.pinned ? 'md-arrow-down' : 'md-arrow-up';
    return (
      <Button full onPress={() => onPinClicked(topic) }>
        <Icon active name={pinIconName} />
      </Button>
    );
  }

  return (
    <Container>
      <List 
        containerStyle={{marginBottom: 20}}
        dataSource={ds.cloneWithRows(topics)}
        rightOpenValue={-75} 
        renderRow={renderTopic} 
        renderRightHiddenRow={renderPinButton}    
      />
    </Container>
  );
}
