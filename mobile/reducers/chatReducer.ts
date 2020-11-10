import { 
  CHAT_TITLE,
  CHAT_TOPIC_ID,
} from "../constants/action-types";
import { mutationHelper, reducerMain } from '../lib/helpers';

const initialState = {
  title: 'Chat',
  topicId: null,
};

const reducerFunctions = {
  [CHAT_TITLE]: mutationHelper('title'),
  [CHAT_TOPIC_ID]: mutationHelper('topicId'),
};

export default reducerMain(initialState, reducerFunctions);
