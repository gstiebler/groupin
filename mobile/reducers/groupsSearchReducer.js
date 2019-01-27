import { 
  GROUPS_SEARCH_TEXT,
  GROUPS_SEARCH_ITEMS,
} from "../constants/action-types";
import { mutationHelper, reducerMain } from '../lib/helpers';

const initialState = {
  searchText: '',
  groups: [],
};

const reducerFunctions = {
  [GROUPS_SEARCH_TEXT]: mutationHelper('searchText'),
  [GROUPS_SEARCH_ITEMS]: mutationHelper('groups'),
  // TODO: merge groups option
};

export default reducerMain(initialState, reducerFunctions);
