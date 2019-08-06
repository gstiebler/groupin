import React from 'react';
import { List, ListItem, Button } from 'react-native-elements'
import { SafeAreaView } from 'react-native';

export default TopicsListComponent = ({ navigation, topics, selectTopic, onLeaveGroup, willFocus, willLeave }) => {
  navigation.addListener('willFocus', willFocus);
  navigation.addListener('willBlur', willLeave);

  const topicItems = topics.map((topic) => (
    <ListItem
      // roundAvatar
      // avatar={{ uri: topic.imgUrl }}
      key={topic.id}
      title={topic.name}
      onPress={() => selectTopic(navigation, topic.id, topic.name)}
    />
  ));

  return (
    <SafeAreaView>
      <Button title="Sair do grupo" onPress={() => onLeaveGroup(navigation)} style={{marginBottom: 20, marginTop: 20}} />
      <List containerStyle={{marginBottom: 20}}>
        { topicItems }
      </List>
   </SafeAreaView>
  );
}
