import React from 'react';
import { FlatList, Item, View } from 'react-native';
import { Container, Button, Text, Icon, Left } from 'native-base';

export default ({ navigation, topics, selectTopic, onPinClicked, willFocus, willLeave }) => {
  navigation.addListener('willFocus', willFocus);
  navigation.addListener('willBlur', willLeave);

  const pinLeftIcon = (
    <Left>
      <Icon name="md-arrow-up" />
    </Left>
  );

  const renderTopic = topic => {
    const fontWeight = topic.unread ? 'bold' : 'normal';
    return (
      <Item onPress={() => selectTopic(navigation, topic.id, topic.name) }>
        { topic.pinned ? pinLeftIcon : <View /> }
        <Text style={{ fontWeight }}> {"  " + topic.name} </Text>
      </Item>
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
      <FlatList 
        containerStyle={{marginBottom: 20}}
        data={topics}
        rightOpenValue={-75} 
        renderRow={renderTopic} 
        renderRightHiddenRow={renderPinButton}    
      />
    </Container>
  );
}
