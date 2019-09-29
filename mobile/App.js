import React from 'react';
import Navigator from './components/Navigator';
import { Root } from "native-base";
import { Provider } from "react-redux";
import store from "./store/rootStore";

export default class App extends React.Component {

  render() {
    return (
      <Root>
        <Provider store={store}>
          <Navigator />
        </Provider>
      </Root>
    );
  }
}
