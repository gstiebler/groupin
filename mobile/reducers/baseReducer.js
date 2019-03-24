import { 
  ADD_MESSSAGES,
  SET_OWN_GROUPS,
  SET_TOPICS,
  SET_MESSAGES,
  SET_TOKEN,
  FCM_TOKEN,
  USER_ID,
  CURRENTLY_VIEWED_GROUP_ID,
  CURRENTLY_VIEWED_TOPIC_ID,
} from "../constants/action-types";
import mergeMessages from '../lib/mergeMessages';
import { mutationHelper, reducerMain } from '../lib/helpers';
import * as graphqlConect from '../lib/graphqlConnect';

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
  token: null,
  fcmToken: null,
  userId: '',
  currentlyViewedGroupId: null,
  currentlyViewedTopicId: null,
};

const addMessages = (state, { messages }) => ({
  ...state, 
  messages: mergeMessages(state.messages, messages),
});

const setToken = (state, { token }) => {
  graphqlConect.setToken(token);
  return {
    ...state,
    token,
  };
}

const reducerFunctions = {
  [ADD_MESSSAGES]: addMessages,
  [SET_OWN_GROUPS]: mutationHelper('ownGroups'),
  [SET_TOPICS]: mutationHelper('topics'),
  [SET_MESSAGES]: mutationHelper('messages'),
  [CURRENTLY_VIEWED_GROUP_ID]: mutationHelper('currentlyViewedGroupId'),
  [CURRENTLY_VIEWED_TOPIC_ID]: mutationHelper('currentlyViewedTopicId'),
  [USER_ID]: mutationHelper('userId'),
  [FCM_TOKEN]: mutationHelper('fcmToken'),
  [SET_TOKEN]: setToken,
};

export default reducerMain(initialState, reducerFunctions);
