import firebase from 'react-native-firebase';
import { 
  FIREBASE_TOKEN,
} from "./constants/action-types";
import store from "./store/rootStore";

export default async function init() {
  const fcmToken = await firebase.messaging().getToken();
  if (fcmToken) {
      store.dispatch({ type: FIREBASE_TOKEN, payload: { fcmToken } });
  } else {
    console.log('no firebase token');
  }    
  const onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
    store.dispatch({ type: FIREBASE_TOKEN, payload: { fcmToken } });
  });
}
