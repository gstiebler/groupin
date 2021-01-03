import React from 'react';
import Navigator from './components/Navigator';
import {Root} from 'native-base';

export default class App extends React.Component {
  render() {
    return (
      <Root>
        <Navigator />
      </Root>
    );
  }
}
