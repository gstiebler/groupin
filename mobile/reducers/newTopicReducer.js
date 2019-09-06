const { 
  // NEW_TOPIC_NAME,
} = require("../constants/action-types");

const { mutationHelper, reducerMain } = require('../lib/helpers');

const initialState = {
  // name: '',
};

const reducerFunctions = {
  // [NEW_TOPIC_NAME]: mutationHelper('name'),
};

module.exports = reducerMain(initialState, reducerFunctions);
