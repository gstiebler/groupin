import { 
  CHAT_TITLE,
} from "../constants/action-types";
import { mutationHelper, reducerMain } from '../lib/helpers';

const initialState = {
  title: 'Chat',
};

const reducerFunctions = {
  [CHAT_TITLE]: mutationHelper('title'),
};

export default reducerMain(initialState, reducerFunctions);
