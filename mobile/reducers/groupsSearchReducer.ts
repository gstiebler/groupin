import { 
  GROUPS_SEARCH_ITEMS,
} from "../constants/action-types";
import { mutationHelper, reducerMain } from '../lib/helpers';

const initialState = {
  groups: [],
};

const reducerFunctions = {
  [GROUPS_SEARCH_ITEMS]: mutationHelper('groups'),
  // TODO: merge groups option
};

export default reducerMain(initialState, reducerFunctions);
