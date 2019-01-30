import React from 'react';
import { List, ListItem, Button } from 'react-native-elements'
import { SafeAreaView } from 'react-native';

export default TopicsListComponent = ({ navigation, topics, selectTopic, onAddTopic, willFocus }) => {
  navigation.addListener('willFocus', willFocus);

  const topicItems = topics.map((topic) => (
    <ListItem
      roundAvatar
      avatar={{ uri: topic.imgUrl }}
      key={topic.id}
      title={topic.name}
      onPress={() => selectTopic(navigation, topic.id, topic.name)}
    />
  ));

  return (
    <SafeAreaView>
      <Button title="Adicionar tópico" onPress={() => onAddTopic(navigation)} />
      <List containerStyle={{marginBottom: 20}}>
        { topicItems }
      </List>
   </SafeAreaView>
  );
}
