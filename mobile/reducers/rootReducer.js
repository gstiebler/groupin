import { combineReducers } from 'redux';
import base from './baseReducer';
import register from './registerReducer';

const rootReducer = combineReducers({
  base,
  register,
});

export default rootReducer;
