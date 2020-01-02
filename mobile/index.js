/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
// Only to avoid crashing on data messages when in background
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', async () => { 
  console.log('** RNFirebaseBackgroundMessage');
  return Promise.resolve();
});
