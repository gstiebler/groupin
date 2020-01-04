// import _ from 'lodash';
import * as FCM from './lib/fcm';
import * as loginActions from './actions/loginActions';
import store from "./store/rootStore";

export default async function init(navigate) {
  const dispatch = store.dispatch.bind(store);
  await loginActions.init(navigate, dispatch);
  await FCM.init(navigate);
}
