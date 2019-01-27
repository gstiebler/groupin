import { combineReducers } from 'redux';
import base from './baseReducer';
import register from './registerReducer';
import login from './loginReducer';

const rootReducer = combineReducers({
  base,
  register,
  login,
});

export default rootReducer;
