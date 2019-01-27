import React from 'react';
import Navigator from './components/Navigator';
import { Provider } from "react-redux";
import store from "./store/rootStore";

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Navigator />
      </Provider>
    );
  }
}
