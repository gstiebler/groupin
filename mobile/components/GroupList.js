import React from 'react';
// import { Text, FlatList } from 'react-native';
import { connect } from "react-redux";
import { getTopicsOfGroup } from '../actions/rootActions';
import { List, ListItem } from 'react-native-elements'
import { SafeAreaView } from 'react-native';

const mapStateToProps = state => {
  return { ownGroups: state.ownGroups };
};

const mapDispatchToProps = dispatch => {
  return {
    selectGroup: (groupId) => { 
      console.log(groupId);
      getTopicsOfGroup(dispatch, groupId);
    }
  };
};

const GroupListComponent = ({ownGroups, selectGroup, navigation}) => {
  return (
    <SafeAreaView>
      <List containerStyle={{marginBottom: 20}}>
        {
          ownGroups.map((group) => (
            <ListItem
              roundAvatar
              avatar={{ uri: group.imgUrl }}
              key={group.id}
              title={group.name}
              onPress={() => { selectGroup(group.id); navigation.navigate('TopicsList'); } }
            />
          ))
        }
    </List>
   </SafeAreaView>
  );
}


const GroupList = connect(mapStateToProps, mapDispatchToProps)(GroupListComponent);
export default GroupList;
