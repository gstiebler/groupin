import { 
  ADD_MESSSAGES,
  SET_OWN_GROUPS,
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
    default:
      return state;
  }
};

export default rootReducer;
