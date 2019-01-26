import { 
  REGISTER_NAME,
  REGISTER_USERNAME,
  REGISTER_PASSWORD,
} from "../constants/action-types";
import { mutationHelper, reducerMain } from '../lib/helpers';

const initialState = {
  name: '',
  user: '',
  password: '',
};

const reducerFunctions = {
  [REGISTER_NAME]: mutationHelper('name'),
  [REGISTER_USERNAME]: mutationHelper('user'),
  [REGISTER_PASSWORD]: mutationHelper('password'),
};

export default reducerMain(initialState, reducerFunctions);
