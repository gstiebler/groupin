import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers/rootReducer";
import { composeWithDevTools } from 'remote-redux-devtools';
import thunk from 'redux-thunk';

const store = createStore(
  rootReducer, 
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
