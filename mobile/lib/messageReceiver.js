import store from '../store/rootStore';
import { 
  getTopicsOfCurrentGroup,
  getMessagesOfCurrentTopic,
} from '../actions/rootActions';

import * as receiver from './pusherReceiver';

const channel = 'my-channel';
const event = 'my-event';
receiver.subscribe(channel, event, data => {
  console.log(JSON.stringify(data));
  getTopicsOfCurrentGroup(store);
  getMessagesOfCurrentTopic(store);
});
