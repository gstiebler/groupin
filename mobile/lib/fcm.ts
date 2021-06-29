import messaging from '@react-native-firebase/messaging';
import { NavFn } from '../components/Navigator';
import { rootStore } from '../stores/storesFactory';

import * as messageReceiver from './messageReceiver';

let tokenRefreshListener;
let messagesListener;
let notificationOpenedListener;
let _navigateFn: NavFn;

export async function init(navigateFn: NavFn) {
  _navigateFn = navigateFn;
  tokenRefreshListener = messaging().onTokenRefresh(fcmToken => {
    rootStore.updateFcmToken(fcmToken);
  });

  const hasPermission = await messaging().hasPermission();
  if (hasPermission) {
    console.log('FCM has permission');
    await startMessageListener();
  } else {
    try {
      await messaging().requestPermission();
      console.log('User has authorized messaging');
      startMessageListener();
    } catch (error) {
      console.error('User has not authorized messaging');
    }
  }

}

export async function getAndUpdateFcmToken() {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    await rootStore.updateFcmToken(fcmToken);
  } else {
    console.log('no firebase token');
  }  
}

async function startMessageListener() { 
  await getAndUpdateFcmToken();
  messagesListener = messaging().onMessage((message) => {
    console.log('received message: ', message);
    messageReceiver.messageReceived(message);
  });

  notificationOpenedListener = messaging().onNotificationOpenedApp(notificationOpen => {
    console.log('onNotificationOpenedApp');
    messageReceiver.onNotificationOpened(_navigateFn, notificationOpen);
  });

  messaging().getInitialNotification().then(notificationOpen => {
    console.log('getInitialNotification');
    messageReceiver.onInitialNotification(_navigateFn, notificationOpen);
  });
}

export async function subscribeToTopic(topic) {
  messaging().subscribeToTopic(topic);
}

export async function unsubscribeFromTopic(topic) {
  messaging().unsubscribeFromTopic(topic);
}

export function releaseListeners() {
  tokenRefreshListener();
  messagesListener();
  notificationOpenedListener();
}
