import firebase, { RemoteMessage } from 'react-native-firebase';
import { 
  FCM_TOKEN,
} from "../constants/action-types";
import store from "../store/rootStore";

let tokenRefreshListener;
let messagesListener;

export async function init() {
  const fcmToken = await firebase.messaging().getToken();
  if (fcmToken) {
      store.dispatch({ type: FCM_TOKEN, payload: { fcmToken } });
  } else {
    console.log('no firebase token');
  }    
  tokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
    store.dispatch({ type: FCM_TOKEN, payload: { fcmToken } });
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
  firebase.messaging().subscribeToTopic('groupin_main');
  messageListener = firebase.messaging().onMessage((message) => {
    console.log('received message: ', message);
  });
}
