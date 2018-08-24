import React from 'react';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import FirstNB from './components/FirstNativeBase';
import SearchBar from './components/SearchBar';
import Chat from './components/Chat';
import GroupList from './components/GroupList';
import { Provider } from "react-redux";
import store from "./store/index";
import { fetchOwnGroups } from './actions';

fetchOwnGroups();

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <SafeAreaView>
          <GroupList />
        </SafeAreaView>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
