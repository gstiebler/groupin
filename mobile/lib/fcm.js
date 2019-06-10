import firebase, { RemoteMessage } from 'react-native-firebase';
import { 
  updateFcmToken,
} from "../actions/rootActions";
import store from "../store/rootStore";

import messageReceiver from './messageReceiver';

let tokenRefreshListener;
let messagesListener;
let notificationOpenedListener;

export async function init() {
  tokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
    updateFcmToken(store, fcmToken);
  });

  const hasPermission = await firebase.messaging().hasPermission();
  if (hasPermission) {
    console.log('FCM has permission');
    startMessageListener();
  } else {
    try {
      await firebase.messaging().requestPermission();
      console.log('User has authorized messaging');
      startMessageListener();
    } catch (error) {
      console.log('User has not authorized messaging');
    }
  }

}

async function startMessageListener() {
  const fcmToken = await firebase.messaging().getToken();
  if (fcmToken) {
    updateFcmToken(store, fcmToken);
  } else {
    console.log('no firebase token');
  }   

  // firebase.messaging().subscribeToTopic(topic);
  messagesListener = firebase.messaging().onMessage((message) => {
    console.log('received message: ', message);
    messageReceiver.messageReceived(store, message);
  });

  notificationOpenedListener = firebase.notifications().onNotificationOpened(notificationOpen => {
    messageReceiver.messageReceived(store, notificationOpen);
  });

  firebase.notifications().getInitialNotification()
    .then(notificationOpen => {
      messageReceiver.onInitialNotification(store, notificationOpen);
    });
}

export function releaseListeners() {
  tokenRefreshListener();
  messagesListener();
  notificationOpenedListener();
}
