
export const mutationHelper = propertyName => (state, payload) => ({
  ...state,
  [propertyName]: payload[propertyName],
});

export const reducerMain = (initialState, reducerFunctions) => (state = initialState, action) => {
  const reducerFunction = reducerFunctions[action.type];
  if (!reducerFunction) {
    return state;
  }
  return reducerFunction(state, action.payload);
};
