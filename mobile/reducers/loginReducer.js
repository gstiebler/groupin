const { 
  LOGIN_USERNAME,
  LOGIN_PASSWORD,
} = require("../constants/action-types");
const { mutationHelper, reducerMain } = require('../lib/helpers');

const initialState = {
  username: '',
  password: '',
};

const reducerFunctions = {
  [LOGIN_USERNAME]: mutationHelper('username'),
  [LOGIN_PASSWORD]: mutationHelper('password'),
};

module.exports = reducerMain(initialState, reducerFunctions);
