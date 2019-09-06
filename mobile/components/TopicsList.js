import React from 'react';
import { Container, Header, Content, List, ListItem, Text } from 'native-base';

export default TopicsListComponent = ({ navigation, topics, selectTopic, willFocus, willLeave }) => {
  navigation.addListener('willFocus', willFocus);
  navigation.addListener('willBlur', willLeave);

  const topicItems = topics.map((topic) => (
    <ListItem onPress={() => selectTopic(navigation, topic.id, topic.name)} >
      <Text>{topic.name}</Text>
    </ListItem>
  ));

  return (      
    <Container>
      <Content>
        <List>
          { topicItems }
        </List>
      </Content>
    </Container>
  );
}
