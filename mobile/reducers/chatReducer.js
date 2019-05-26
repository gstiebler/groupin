const { 
  CHAT_TITLE,
  CHAT_TOPIC_ID,
} = require("../constants/action-types");
const { mutationHelper, reducerMain } = require('../lib/helpers');

const initialState = {
  title: 'Chat',
  topicId: null,
};

const reducerFunctions = {
  [CHAT_TITLE]: mutationHelper('title'),
  [CHAT_TOPIC_ID]: mutationHelper('topicId'),
};

module.exports.default = reducerMain(initialState, reducerFunctions);
