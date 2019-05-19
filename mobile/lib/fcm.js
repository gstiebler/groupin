import firebase, { RemoteMessage } from 'react-native-firebase';
import { 
  updateFcmToken,
} from "../actions/rootActions";
import store from "../store/rootStore";

let tokenRefreshListener;
let messagesListener;

const topic = 'groupin_main';

export async function init() {
  const fcmToken = await firebase.messaging().getToken();
  if (fcmToken) {
    updateFcmToken(store, fcmToken);
  } else {
    console.log('no firebase token');
  }    
  tokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
    updateFcmToken(store, fcmToken);
  });

  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
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

function startMessageListener() {
  firebase.messaging().subscribeToTopic(topic);
  messageListener = firebase.messaging().onMessage((message) => {
    console.log('received message: ', message);
  });
}

export function releaseListeners() {
  tokenRefreshListener();
  messagesListener();
}
