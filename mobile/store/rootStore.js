const { createStore, applyMiddleware } = require('redux');
const rootReducer = require('../reducers/rootReducer');
const { composeWithDevTools } = require('remote-redux-devtools');
const thunk = require('redux-thunk').default;

const store = createStore(
  rootReducer,
  {},
  composeWithDevTools(applyMiddleware(thunk))
);

if (module.hot) {
  module.hot.accept(() => {
    const nextRootReducer = require('../reducers/rootReducer');
    store.replaceReducer(nextRootReducer);
  });
}

module.exports = store;
