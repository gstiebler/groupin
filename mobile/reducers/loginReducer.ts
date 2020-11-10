import { 
  LOGIN_PHONE_NUMBER,
  FB_CONFIRM_RESULT,
} from "../constants/action-types";
import { mutationHelper, reducerMain } from '../lib/helpers';

const initialState = {
  phoneNumber: '',
  confirmResult: null,
};

const reducerFunctions = {
  [LOGIN_PHONE_NUMBER]: mutationHelper('phoneNumber'),
  [FB_CONFIRM_RESULT]: mutationHelper('confirmResult'),
};

export default reducerMain(initialState, reducerFunctions);
