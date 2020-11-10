import { combineReducers } from 'redux';
import base from './baseReducer';
import login from './loginReducer';
import groupsSearch from './groupsSearchReducer';
import chat from './chatReducer';
// import newTopic from './newTopicReducer';

const rootReducer = combineReducers({
  base,
  login,
  groupsSearch,
  chat,
});

export default rootReducer;
