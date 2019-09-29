import React from 'react';
import Navigator from './components/Navigator';
import { Root } from "native-base";
import { Provider } from "react-redux";
import store from "./store/rootStore";
import init from './appInit';


export default class App extends React.Component {

  componentDidMount() {
    init();
  }

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
