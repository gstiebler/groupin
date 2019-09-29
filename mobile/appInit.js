import _ from 'lodash';
import * as FCM from './lib/fcm';

export default async function init() {
  await FCM.init();
}
