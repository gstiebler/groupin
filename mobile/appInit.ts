// import _ from 'lodash';
import * as FCM from './lib/fcm';
import { NavFn } from './components/Navigator';

export default async function init(navigate: NavFn) {
  await FCM.init(navigate);
}
