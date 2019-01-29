import { combineReducers } from 'redux';
import base from './baseReducer';
import register from './registerReducer';
import login from './loginReducer';
import groupsSearch from './groupsSearchReducer';
import chat from './chatReducer';
import newTopic from './newTopicReducer';

const rootReducer = combineReducers({
  base,
  register,
  login,
  groupsSearch,
  chat,
  newTopic,
});

export default rootReducer;
