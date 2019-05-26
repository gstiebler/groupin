
const mutationHelper = propertyName => (state, payload) => {
  return {
    ...state,
    [propertyName]: payload[propertyName],
  }
}

const reducerMain = (initialState, reducerFunctions) => (state = initialState, action) => {
  const reducerFunction = reducerFunctions[action.type];
  if (!reducerFunction) {
    return state;
  }
  return reducerFunction(state, action.payload);
};

module.exports = {
  mutationHelper,
  reducerMain,
};
