const { combineReducers } = require('redux');
const base = require('./baseReducer');
const login = require('./loginReducer');
const groupsSearch = require('./groupsSearchReducer');
const chat = require('./chatReducer');
const newTopic = require('./newTopicReducer');

const rootReducer = combineReducers({
  base,
  login,
  groupsSearch,
  chat,
  newTopic,
});

module.exports = rootReducer;
