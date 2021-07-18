import { makeAutoObservable } from "mobx";
import { Alert } from 'react-native';
import { localStorage } from '../rn_lib/localStorage';

// import { notifications } from '../lib/notifications';

import { RootStore } from './rootStore';
import { LoginStore } from './loginStore';
import { GroupStore } from './groupStore';
import { GroupSearchStore } from "./groupSearchStore";

export const groupStore = makeAutoObservable(new GroupStore());
export const groupSearchStore = makeAutoObservable(new GroupSearchStore());
export const rootStore = makeAutoObservable(new RootStore(localStorage, groupStore));
export const loginStore = makeAutoObservable(new LoginStore(rootStore, Alert));
