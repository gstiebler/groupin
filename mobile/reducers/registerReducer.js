const { 
  REGISTER_NAME,
  REGISTER_VERIFICATION_CODE,
} = require("../constants/action-types");
const { mutationHelper, reducerMain } = require('../lib/helpers');

const initialState = {
  name: '',
  verificationCode: '',
};

const reducerFunctions = {
  [REGISTER_NAME]: mutationHelper('name'),
  [REGISTER_VERIFICATION_CODE]: mutationHelper('verificationCode'),
};

module.exports = reducerMain(initialState, reducerFunctions);
