/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

// Only to avoid crashing on data messages when in background
const bgMessaging = async (message) => {
  // handle your message
  console.log(`** RNFirebaseBackgroundMessage ${message}`);
  return Promise.resolve();
}
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);
