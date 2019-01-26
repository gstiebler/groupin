import { createStore } from "redux";
import rootReducer from "../reducers/rootReducer";
import devToolsEnhancer from 'remote-redux-devtools';

const store = createStore(rootReducer, devToolsEnhancer());

export default store;
