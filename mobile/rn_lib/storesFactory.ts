import { makeAutoObservable } from "mobx";
import { Alert } from 'react-native';
import { localStorage } from './localStorage';

// import { notifications } from '../lib/notifications';

import { RootStore } from '../stores/rootStore';
import { LoginStore } from '../stores/loginStore';
import { GroupStore } from '../stores/groupStore';
import { GroupSearchStore } from "../stores/groupSearchStore";

export const groupStore = makeAutoObservable(new GroupStore());
export const groupSearchStore = makeAutoObservable(new GroupSearchStore());
export const rootStore = makeAutoObservable(new RootStore(localStorage, groupStore));
export const loginStore = makeAutoObservable(new LoginStore(rootStore, Alert));
