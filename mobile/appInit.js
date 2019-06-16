import _ from 'lodash';
import * as FCM from './lib/fcm';
import * as auth from './lib/auth';
import store from './store/rootStore';
import { 
  SET_TOKEN,
} from "./constants/action-types";

export default async function init() {
  const token = await auth.getToken();
  console.log(token);
  if (token !== null) {
    store.dispatch({ type: SET_TOKEN, payload: { token } });
    console.log(getState().base.fcmToken);
    await FCM.init();
  }
}
