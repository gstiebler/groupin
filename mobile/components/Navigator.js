import React, { Component } from 'react'

import Chat from './Chat';
import GroupList from './GroupList';

import { createStackNavigator } from 'react-navigation'

export const Navigator = createStackNavigator(
  {
    GroupList: { screen: GroupList },
    Chat: { screen: Chat },
  },
  { initialRouteName: 'GroupList' }
);

export default Navigator;
