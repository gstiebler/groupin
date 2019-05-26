const { combineReducers } = require('redux');
const base = require('./baseReducer');
const register = require('./registerReducer');
const login = require('./loginReducer');
const groupsSearch = require('./groupsSearchReducer');
const chat = require('./chatReducer');
const newTopic = require('./newTopicReducer');

const rootReducer = combineReducers({
  base,
  register,
  login,
  groupsSearch,
  chat,
  newTopic,
});

module.exports = rootReducer;
