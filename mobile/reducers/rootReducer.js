import { 
  ADD_MESSSAGES,
  SET_OWN_GROUPS,
  SET_TOPICS,
  SET_MESSAGES,
} from "../constants/action-types";
import mergeMessages from '../lib/mergeMessages';

const mutationHelper = propertyName => (state, payload) => ({
  ...state,
  [propertyName]: payload[propertyName],
});

const initialState = {
  messages: [
    {
      _id: 1,
      text: 'Hello developer',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'React Native',
        avatar: 'https://placeimg.com/140/140/any',
      },
    },
  ],
  ownGroups: [],
  topics: [],
};

const addMessages = (state, payload) => ({
  ...state, 
  messages: mergeMessages(state.messages, payload.messages),
});

const reducerFunctions = {
  [ADD_MESSSAGES]: addMessages,
  [SET_OWN_GROUPS]: mutationHelper('ownGroups'),
  [SET_TOPICS]: mutationHelper('topics'),
  [SET_MESSAGES]: mutationHelper('messages'),
};

const rootReducer = (state = initialState, action) => {
  const reducerFunction = reducerFunctions[action.type];
  if (!reducerFunction) {
    return state;
  }
  return reducerFunction(state, action.payload);
};

export default rootReducer;
