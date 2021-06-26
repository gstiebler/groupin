import messaging from '@react-native-firebase/messaging';
import { 
  updateFcmToken,
} from "../actions/rootActions";
import store from "../store/rootStore";

import * as messageReceiver from './messageReceiver';

let tokenRefreshListener;
let messagesListener;
let notificationOpenedListener;
let _navigateFn;

export async function init(navigateFn) {
  _navigateFn = navigateFn;
  tokenRefreshListener = messaging().onTokenRefresh(fcmToken => {
    updateFcmToken(store, fcmToken);
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
    await updateFcmToken(store, fcmToken);
  } else {
    console.log('no firebase token');
  }  
}

async function startMessageListener() { 
  await getAndUpdateFcmToken();
  messagesListener = messaging().onMessage((message) => {
    console.log('received message: ', message);
    messageReceiver.messageReceived(store, message);
  });

  notificationOpenedListener = messaging().onNotificationOpenedApp(notificationOpen => {
    console.log('onNotificationOpenedApp');
    messageReceiver.onNotificationOpened(_navigateFn, store, notificationOpen);
  });

  messaging().getInitialNotification().then(notificationOpen => {
    console.log('getInitialNotification');
    messageReceiver.onInitialNotification(_navigateFn, store, notificationOpen);
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
