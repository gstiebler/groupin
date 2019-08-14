const { 
  LOGIN_PHONE_NUMBER,
  FB_CONFIRM_RESULT,
} = require("../constants/action-types");
const { mutationHelper, reducerMain } = require('../lib/helpers');

const initialState = {
  phoneNumber: '',
  confirmResult: null,
};

const reducerFunctions = {
  [LOGIN_PHONE_NUMBER]: mutationHelper('phoneNumber'),
  [FB_CONFIRM_RESULT]: mutationHelper('confirmResult'),
};

module.exports = reducerMain(initialState, reducerFunctions);
