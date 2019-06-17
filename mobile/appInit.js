import _ from 'lodash';
import * as FCM from './lib/fcm';
import store from './store/rootStore';
import { 
  SET_TOKEN,
} from "./constants/action-types";

export default async function init() {
  await FCM.init();
}
