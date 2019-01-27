import { combineReducers } from 'redux';
import base from './baseReducer';
import register from './registerReducer';
import login from './loginReducer';
import groupsSearch from './groupsSearchReducer';

const rootReducer = combineReducers({
  base,
  register,
  login,
  groupsSearch,
});

export default rootReducer;
