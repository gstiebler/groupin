import React from 'react';
// import { Text, FlatList } from 'react-native';
import { connect } from "react-redux";
import { getMessagesOfTopic } from '../actions/rootActions';
import { List, ListItem } from 'react-native-elements'
import { SafeAreaView } from 'react-native';

const mapStateToProps = state => {
  return { topics: state.topics };
};

const mapDispatchToProps = dispatch => {
  return {
    selectTopic: (topicId) => { 
      console.log(topicId);
      getMessagesOfTopic(dispatch, topicId);
    }
  };
};

const TopicsListComponent = ({topics, selectTopic, navigation}) => {
  return (
    <SafeAreaView>
      <List containerStyle={{marginBottom: 20}}>
        {
          topics.map((topic) => (
            <ListItem
              roundAvatar
              avatar={{ uri: topic.imgUrl }}
              key={topic.id}
              title={topic.name}
              onPress={() => { selectTopic(topic.id); navigation.navigate('Chat'); } }
            />
          ))
        }
    </List>
   </SafeAreaView>
  );
}


const TopicsList = connect(mapStateToProps, mapDispatchToProps)(TopicsListComponent);
export default TopicsList;
