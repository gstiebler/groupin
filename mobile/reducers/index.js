import { 
  ADD_MESSSAGES,
  SET_OWN_GROUPS,
  SET_TOPICS,
  SET_MESSAGES,
} from "../constants/action-types";
import mergeMessages from '../lib/mergeMessages';

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

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSSAGES:
      return { 
        ...state, 
        messages: mergeMessages(state.messages, action.messages),
      };
    case SET_OWN_GROUPS:
      return { 
        ...state, 
        ownGroups: action.ownGroups,
      };
    case SET_TOPICS:
      return { 
        ...state, 
        topics: action.topics,
      };
    case SET_MESSAGES:
      return { 
        ...state, 
        messages: action.messages,
      };
    default:
      return state;
  }
};

export default rootReducer;
