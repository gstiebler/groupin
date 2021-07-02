import { makeAutoObservable } from "mobx";
import { Alert } from 'react-native';
import { getAndUpdateFcmToken } from '../lib/fcm';
import auth from '@react-native-firebase/auth';

import { RootStore } from './rootStore';
import { LoginStore } from './loginStore';
import { GroupStore } from './groupStore';

export const groupStore = makeAutoObservable(new GroupStore());
export const rootStore = makeAutoObservable(new RootStore(groupStore));
export const loginStore = makeAutoObservable(new LoginStore(rootStore, Alert, auth, getAndUpdateFcmToken));
