import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/rootReducer';
import { composeWithDevTools } from 'remote-redux-devtools';
import thunk from 'redux-thunk';

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

export default store;
