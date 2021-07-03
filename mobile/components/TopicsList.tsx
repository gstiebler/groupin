import React from 'react';
import { TouchableHighlight, View, StyleSheet, ListRenderItemInfo } from 'react-native';
import { Container, Button, Text, Icon } from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';
import * as _ from 'lodash';
import { Topic } from '../stores/rootStore';

export type TopicsListProps = {
  topics: Topic[];
  selectTopic: (topicId: string, topicName: string) => void;
  onPinClicked: (topic: Topic) => void;
};

const TopicListComponent: React.FC<TopicsListProps> =  ({ topics, selectTopic, onPinClicked }) => {
  const renderTopic = ({ item: topic }: { item: Topic }) => {
    const fontWeight = topic.unread ? 'bold' : 'normal';
    return (
      <TouchableHighlight
      onPress={() => selectTopic(topic.id, topic.name) }
        style={styles.rowFront}
        underlayColor={'#AAA'}
      >
        <View style={styles.frontView}>   
          { topic.pinned ? <Icon name="md-arrow-up" /> : <View style={{ paddingLeft: 10 }}/> }
          <Text 
            style={{ fontWeight }}
            onPress={() => selectTopic(topic.id, topic.name) }
          >{ topic.name } </Text>
        </View>
      </TouchableHighlight>
    );
  };

  const renderHiddenItem = ({ item: topic }: ListRenderItemInfo<Topic>) => {
    const pinIconName = topic.pinned ? 'md-arrow-down' : 'md-arrow-up';
    return (
      <View style={styles.rowBack}>
        <View />
        <Button 
          style={styles.backRightBtn}
          full onPress={() => onPinClicked(topic) }>
          <Icon active name={pinIconName} />
        </Button>
      </View>
    );
  };

  const getEmpty = () => <Text style={{ padding: 10 }}>Nenhum tópico criado</Text>

  return _.isEmpty(topics) ? getEmpty() : (
    <Container>
      <SwipeListView<Topic>
        data={topics}
        rightOpenValue={-50} 
        renderItem={renderTopic}
        renderHiddenItem={renderHiddenItem}   
      />
    </Container>
  );
}
export default TopicListComponent;

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
