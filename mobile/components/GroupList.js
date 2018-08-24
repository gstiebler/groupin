import React from 'react';
import { Text, FlatList } from 'react-native';
import { connect } from "react-redux";
import {  } from '../actions/index';

const mapStateToProps = state => {
  return { ownGroups: state.ownGroups };
};

const mapDispatchToProps = dispatch => {
  return {
    selectGroup: () => {}
  };
};

const GroupListComponent = ({ownGroups, selectGroup}) => {
  return (
    <FlatList
      data={ownGroups}
      renderItem={({item}) => <Text>{item.name}</Text>}
    />
  );
}

const GroupList = connect(mapStateToProps, mapDispatchToProps)(GroupListComponent);
export default GroupList;
