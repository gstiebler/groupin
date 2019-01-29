import { 
  NEW_TOPIC_NAME,
} from "../constants/action-types";

import { mutationHelper, reducerMain } from '../lib/helpers';

const initialState = {
  name: '',
};

const reducerFunctions = {
  [NEW_TOPIC_NAME]: mutationHelper('name'),
};

export default reducerMain(initialState, reducerFunctions);
