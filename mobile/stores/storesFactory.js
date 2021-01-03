import { makeAutoObservable } from "mobx";

import RootStore from './rootStore';
import LoginStore from './loginStore';
import GroupStore from './groupStore';

const groupStore = makeAutoObservable(new GroupStore());
export const rootStore = makeAutoObservable(new RootStore(groupStore));
export const loginStore = makeAutoObservable(new LoginStore(rootStore, Alert, auth, getAndUpdateFcmToken));
