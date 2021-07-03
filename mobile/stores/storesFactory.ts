import { makeAutoObservable } from "mobx";
import { Alert } from 'react-native';
import { fcm } from '../lib/fcm';

import { RootStore } from './rootStore';
import { LoginStore } from './loginStore';
import { GroupStore } from './groupStore';
import { GroupSearchStore } from "./groupSearchStore";

export const groupStore = makeAutoObservable(new GroupStore());
export const groupSearchStore = makeAutoObservable(new GroupSearchStore());
export const rootStore = makeAutoObservable(new RootStore(groupStore));
export const loginStore = makeAutoObservable(new LoginStore(rootStore, Alert, () => fcm.getAndUpdateFcmToken()));
