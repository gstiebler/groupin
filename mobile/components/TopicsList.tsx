import React from 'react';
import { StyleSheet, ListRenderItemInfo, Pressable } from 'react-native';
import { Button, Text, Box } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import * as _ from 'lodash';
import { Topic } from '../stores/groupStore';

export type TopicsListProps = {
  topics: Topic[];
  selectTopic: (topicId: string, topicName: string) => void;
  onPinClicked: (topic: Topic) => void;
};

const TopicListComponent: React.FC<TopicsListProps> =  ({ topics, selectTopic, onPinClicked }) => {
  const renderTopic = ({ item: topic }: { item: Topic }) => {
    const fontWeight = topic.unread ? 'bold' : 'normal';
    return (
      <Pressable
        onPress={() => selectTopic(topic.id, topic.name) }
        style={styles.rowFront}
      >
        <Box style={styles.frontView}>   
          {topic.pinned ? <Ionicons size={25} name="md-arrow-up" /> : <Box style={{ paddingLeft: 10 }}/> }
          <Text 
            style={{ fontWeight }}
            onPress={() => selectTopic(topic.id, topic.name) }
          >{ topic.name } </Text>
        </Box>
      </Pressable>
    );
  };

  const renderHiddenItem = ({ item: topic }: ListRenderItemInfo<Topic>) => {
    const pinIconName = topic.pinned ? 'md-arrow-down' : 'md-arrow-up';
    return (
      <Box style={styles.rowBack}>
        <Button 
          style={styles.backRightBtn}
          onPress={() => onPinClicked(topic) }>
          <Ionicons name={pinIconName} />
        </Button>
      </Box>
    );
  };

  const getEmpty = () => <Text style={{ padding: 10 }}>Nenhum tópico criado</Text>

  return _.isEmpty(topics) ? getEmpty() : (
    <SwipeListView<Topic>
      data={topics}
      leftOpenValue={50}
      renderItem={renderTopic}
      renderHiddenItem={renderHiddenItem}   
    />
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
