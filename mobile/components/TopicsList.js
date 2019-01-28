import React from 'react';
import { List, ListItem } from 'react-native-elements'
import { SafeAreaView } from 'react-native';

export default TopicsListComponent = ({ navigation, topics, selectTopic, willFocus }) => {
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
      <List containerStyle={{marginBottom: 20}}>
        { topicItems }
      </List>
   </SafeAreaView>
  );
}
