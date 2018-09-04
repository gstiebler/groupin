import React from 'react';
// import { Text, FlatList } from 'react-native';
import { connect } from "react-redux";
import {  } from '../actions/index';
import { List, ListItem } from 'react-native-elements'
import { SafeAreaView } from 'react-native';

const mapStateToProps = state => {
  return { ownGroups: state.ownGroups };
};

const mapDispatchToProps = dispatch => {
  return {
    selectGroup: (group) => { 
      console.log(group);
    }
  };
};

const GroupListComponent = ({ownGroups, selectGroup, navigation}) => {
  console.log(navigation);
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
              onPress={() => { selectGroup(group.id); navigation.navigate('Chat'); } }
            />
          ))
        }
    </List>
   </SafeAreaView>
  );
}


const GroupList = connect(mapStateToProps, mapDispatchToProps)(GroupListComponent);
export default GroupList;
