const { 
  REGISTER_NAME,
  REGISTER_USERNAME,
  REGISTER_PASSWORD,
} = require("../constants/action-types");
const { mutationHelper, reducerMain } = require('../lib/helpers');

const initialState = {
  name: '',
  username: '',
  password: '',
};

const reducerFunctions = {
  [REGISTER_NAME]: mutationHelper('name'),
  [REGISTER_USERNAME]: mutationHelper('username'),
  [REGISTER_PASSWORD]: mutationHelper('password'),
};

module.exports = reducerMain(initialState, reducerFunctions);
