import { 
  LOGIN_USERNAME,
  LOGIN_PASSWORD,
} from "../constants/action-types";
import { mutationHelper, reducerMain } from '../lib/helpers';

const initialState = {
  username: '',
  password: '',
};

const reducerFunctions = {
  [LOGIN_USERNAME]: mutationHelper('username'),
  [LOGIN_PASSWORD]: mutationHelper('password'),
};

export default reducerMain(initialState, reducerFunctions);
