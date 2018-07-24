import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FirstNB from './components/FirstNativeBase';
import SearchBar from './components/SearchBar';
import Chat from './components/Chat';
import { Provider } from "react-redux";
import store from "./store/index";

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Chat />
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
