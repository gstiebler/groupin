import React, { Component } from 'react';
import { Input, Icon, Button, Text, Center } from 'native-base';
export default class SearchBarExample extends Component {
  render() {
    return (
      <Center flex={1}>
        <Icon name="ios-search" />
        <Input placeholder="Search" />
        <Icon name="ios-people" />
        <Button>
          <Text>Search</Text>
        </Button>
      </Center>
    );
  }
}