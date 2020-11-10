import { 
  RESET_BASE,
  ADD_NEW_MESSAGES,
  SET_OWN_GROUPS,
  SET_TOPICS,
  SET_MESSAGES,
  CURRENT_GROUP_INFO,
  FCM_TOKEN,
  USER_ID,
  CURRENTLY_VIEWED_GROUP_ID,
  CURRENTLY_VIEWED_TOPIC_ID,
  HAS_OLDER_MESSAGES,
} from "../constants/action-types";
import { mutationHelper, reducerMain } from '../lib/helpers';
import { mergeMessages } from '../lib/messages';

const initialState = {
  messages: [
    /*{
      _id: 1,
      text: 'Hello developer',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'React Native',
        avatar: 'https://placeimg.com/140/140/any',
      },
    },*/
  ],
  ownGroups: [],
  topics: [], // TODO: change name to `topicsOfGroup`
  fcmToken: null,
  userId: '',
  currentlyViewedGroupId: null,
  currentlyViewedTopicId: null,
  hasOlderMessages: false,
  currentGroupInfo: {},
};

const addNewMessages = (state, { messages }) => ({
  ...state, 
  messages: mergeMessages(state.messages, messages),
});

const reducerFunctions = {
  [RESET_BASE]: () => initialState,
  [ADD_NEW_MESSAGES]: addNewMessages,
  [SET_OWN_GROUPS]: mutationHelper('ownGroups'),
  [SET_TOPICS]: mutationHelper('topics'),
  [SET_MESSAGES]: mutationHelper('messages'),
  [CURRENTLY_VIEWED_GROUP_ID]: mutationHelper('currentlyViewedGroupId'),
  [CURRENTLY_VIEWED_TOPIC_ID]: mutationHelper('currentlyViewedTopicId'),
  [USER_ID]: mutationHelper('userId'),
  [FCM_TOKEN]: mutationHelper('fcmToken'),
  [HAS_OLDER_MESSAGES]: mutationHelper('hasOlderMessages'),
  [CURRENT_GROUP_INFO]: mutationHelper('currentGroupInfo'),
};

export default reducerMain(initialState, reducerFunctions);
