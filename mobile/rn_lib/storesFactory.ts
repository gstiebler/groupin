import { makeAutoObservable } from "mobx";
import { Alert } from 'react-native';
import { localStorage } from './localStorage';

// import { notifications } from '../lib/notifications';

import { RootStore } from '../stores/rootStore';
import { LoginStore } from './loginStore';
import { GroupStore } from '../stores/groupStore';
import { GroupSearchStore } from "../stores/groupSearchStore";
import { TopicStore } from "../stores/topicStore";

export const groupStore = makeAutoObservable(new GroupStore());
export const topicStore = makeAutoObservable(new TopicStore(groupStore, localStorage));
export const groupSearchStore = makeAutoObservable(new GroupSearchStore());
export const rootStore = makeAutoObservable(new RootStore());
export const loginStore = makeAutoObservable(new LoginStore(rootStore, Alert));
